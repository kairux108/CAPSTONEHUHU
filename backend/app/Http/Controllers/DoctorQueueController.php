<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\QueueService;
use Illuminate\Support\Facades\DB;
use App\Services\QueueRecommendationService;

class DoctorQueueController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Doctor - My Queue (Read Only)
    |--------------------------------------------------------------------------
    */

    public function index(Request $request): JsonResponse
    {
        $doctor = $request->user();

        abort_unless(
            $doctor && strtolower($doctor->role) === 'doctor',
            403
        );

        // CURA operates in the Philippines.
        $date = now('Asia/Manila')->toDateString();

        /*
        |--------------------------------------------------------------------------
        | Restrict Records to the Authenticated Doctor
        |--------------------------------------------------------------------------
        */

        $baseQuery = QueueEntry::query()
            ->where('doctor_id', $doctor->id)
            ->whereDate('queue_date', $date)
            ->whereHas('appointment', function ($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            });

        /*
        |--------------------------------------------------------------------------
        | Doctor-Specific Statistics
        |--------------------------------------------------------------------------
        */

        $stats = [
            'total' => (clone $baseQuery)->count(),

            'waiting' => (clone $baseQuery)
                ->where('status', 'waiting')
                ->count(),

            'called' => (clone $baseQuery)
                ->where('status', 'called')
                ->count(),

            'in_consultation' => (clone $baseQuery)
                ->where('status', 'in_consultation')
                ->count(),

            'completed' => (clone $baseQuery)
                ->where('status', 'completed')
                ->count(),

            'emergency' => (clone $baseQuery)
                ->where('priority', 'emergency')
                ->whereIn('status', [
                    'waiting',
                    'called',
                    'in_consultation',
                ])
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Retrieve Queue Entries
        |--------------------------------------------------------------------------
        */

        $entries = (clone $baseQuery)
            ->with([
                'appointment:id,patient_id,doctor_id,appointment_number,appointment_date,appointment_time,appointment_type',
                'appointment.patient:id,patient_number,first_name,middle_name,last_name,sex',
            ])
            ->orderByRaw("
                CASE priority
                    WHEN 'emergency' THEN 1
                    WHEN 'priority' THEN 2
                    ELSE 3
                END
            ")
            ->orderBy('queued_at')
            ->orderBy('id')
            ->paginate(20);

        /*
        |--------------------------------------------------------------------------
        | Return Only Fields Needed by Doctor Queue UI
        |--------------------------------------------------------------------------
        */

        $queueEntries = $entries->getCollection()
            ->map(function (QueueEntry $entry) {
                $appointment = $entry->appointment;
                $patient = $appointment?->patient;

                $patientName = $patient
                    ? trim(implode(' ', array_filter([
                        $patient->first_name,
                        $patient->middle_name,
                        $patient->last_name,
                    ])))
                    : null;

                return [
                    'id' => $entry->id,
                    'queue_number' => $entry->queue_number,
                    'status' => $entry->status,
                    'priority' => $entry->priority,
                    'estimated_wait_minutes' =>
                        $entry->estimated_wait_minutes,
                    'queued_at' => $entry->queued_at,

                    'patient' => $patient ? [
                        'id' => $patient->id,
                        'patient_number' => $patient->patient_number,
                        'name' => $patientName,
                        'sex' => $patient->sex,
                    ] : null,

                    'appointment' => $appointment ? [
                        'id' => $appointment->id,
                        'appointment_number' =>
                            $appointment->appointment_number,
                        'appointment_time' =>
                            $appointment->appointment_time,
                        'appointment_type' =>
                            $appointment->appointment_type,
                    ] : null,
                ];
            })
            ->values()
            ->all();

        return response()->json([
            'date' => $date,
            'doctor' => [
                'id' => $doctor->id,
                'name' => $doctor->name,
            ],
            'stats' => $stats,
            'queue_entries' => $queueEntries,
            'pagination' => [
                'current_page' => $entries->currentPage(),
                'last_page' => $entries->lastPage(),
                'per_page' => $entries->perPage(),
                'total' => $entries->total(),
            ],
        ]);
        


    }

/*
|--------------------------------------------------------------------------
| Doctor - Call Next Patient
|--------------------------------------------------------------------------
|
| Select the next eligible waiting patient assigned to
| the authenticated doctor.
|
*/

public function callNext(
    Request $request,
    QueueService $queueService,
    QueueRecommendationService $queueRecommendationService
): JsonResponse {

    $doctorId = (int) $request->user()->id;
    $date = now('Asia/Manila')->toDateString();


$nextPatient = DB::transaction(function () use (
    $doctorId,
    $date,
    $queueService,
    $queueRecommendationService
) {

        // Serialize simultaneous call-next requests
        // from the same doctor.
        User::query()
            ->whereKey($doctorId)
            ->lockForUpdate()
            ->firstOrFail();

        // Consider only today's queue entries
        // assigned to this doctor.
        $baseQuery = QueueEntry::query()
            ->where('doctor_id', $doctorId)
            ->whereDate('queue_date', $date)
            ->whereHas('appointment', function ($query) use ($doctorId) {
                $query->where('doctor_id', $doctorId);
            });

        // Do not call another patient if one is already
        // called or currently in consultation.
        $hasActivePatient = (clone $baseQuery)
            ->whereIn('status', [
                'called',
                'in_consultation',
            ])
            ->exists();

        abort_if(
            $hasActivePatient,
            409,
            'Finish the current patient before calling the next patient.'
        );

        // Select by priority, then queue arrival order.

        // Use CURA's existing appointment-aware
        // Smart Queue recommendation algorithm.
        $recommendation = $queueRecommendationService
            ->getNextRecommended(
                $date,
                $doctorId
            );

        $recommendedEntry =
            $recommendation['queue_entry'] ?? null;

        abort_unless(
            $recommendedEntry,
            409,
            'No waiting patients are available to call.'
        );

        // Recheck the recommended patient under a row lock.
        // Another request may have changed its status.
        $next = (clone $baseQuery)
            ->whereKey($recommendedEntry->id)
            ->where('status', 'waiting')
            ->lockForUpdate()
            ->first();

        abort_unless(
            $next,
            409,
            'The recommended patient is no longer waiting. Refresh the queue and try again.'
        );

        // Preserve the existing queue transition rules.
        return $queueService->update(
            $next,
            ['status' => 'called']
        );

    }, 3);

    return response()->json([
        'message' => 'Next patient called successfully.',
        'queue_entry' => [
            'id' => $nextPatient->id,
            'queue_number' => $nextPatient->queue_number,
            'status' => $nextPatient->status,
            'doctor_id' => $nextPatient->doctor_id,
            'called_at' => $nextPatient->called_at,
        ],
    ]);
}

    
/*
|--------------------------------------------------------------------------
| Doctor - Get Selected Patient Consultation Context
|--------------------------------------------------------------------------
*/

public function show(
    Request $request,
    QueueEntry $queueEntry
): JsonResponse {

    $doctorId = $request->user()->id;

    /*
    |--------------------------------------------------------------------------
    | Verify Doctor Ownership
    |--------------------------------------------------------------------------
    |
    | A doctor may only load queue entries assigned
    | to their own account and associated appointment.
    |
    */

    $entry = QueueEntry::query()
        ->with(['appointment.patient'])
        ->whereKey($queueEntry->id)
        ->where('doctor_id', $doctorId)
        ->whereDate(
            'queue_date',
            now('Asia/Manila')->toDateString()
        )
        ->whereHas('appointment', function ($query) use ($doctorId) {
            $query->where('doctor_id', $doctorId);
        })
        ->firstOrFail();

    $appointment = $entry->appointment;
    $patient = $appointment?->patient;

    if (!$patient) {
        abort(404, 'Patient record not found.');
    }

    /*
    |--------------------------------------------------------------------------
    | Return Only Required Consultation Information
    |--------------------------------------------------------------------------
    */

    return response()->json([
        'queue_entry' => [
            'id' => $entry->id,
            'queue_number' => $entry->queue_number,
            'status' => $entry->status,
            'priority' => $entry->priority,
        ],

        'patient' => [
            'id' => $patient->id,
            'patient_number' => $patient->patient_number,
            'first_name' => $patient->first_name,
            'middle_name' => $patient->middle_name,
            'last_name' => $patient->last_name,
            'suffix' => $patient->suffix,
            'sex' => $patient->sex,
        ],

        'appointment' => [
            'id' => $appointment->id,
            'appointment_number' => $appointment->appointment_number,
            'appointment_date' =>
                $appointment->appointment_date?->format('Y-m-d'),
            'appointment_time' => $appointment->appointment_time,
            'status' => $appointment->status,
        ],
    ]);
}

}
