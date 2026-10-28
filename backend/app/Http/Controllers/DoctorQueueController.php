<?php

namespace App\Http\Controllers;

use App\Models\QueueEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
