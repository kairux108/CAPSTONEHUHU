<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\QueueEntry;
use App\Services\AppointmentService;
use App\Services\QueueService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;


class ConsultationController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Verify Doctor and Assigned Queue Entry
    |--------------------------------------------------------------------------
    */

    private function assignedEntry(
        Request $request,
        QueueEntry $queueEntry,
        bool $lock = false
    ): QueueEntry {
        $doctor = $request->user();

        abort_unless(
            $doctor && strtolower((string) $doctor->role) === 'doctor',
            403
        );

        $query = QueueEntry::query()
            ->whereKey($queueEntry->id)
            ->where('doctor_id', $doctor->id)
            ->whereDate(
                'queue_date',
                now('Asia/Manila')->toDateString()
            )
            ->whereHas('appointment', function ($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            });

        if ($lock) {
            $query->lockForUpdate();
        }

        return $query->firstOrFail();
    }

    /*
    |--------------------------------------------------------------------------
    | GET - Load Saved Consultation
    |--------------------------------------------------------------------------
    */

    public function show(
        Request $request,
        QueueEntry $queueEntry
    ): JsonResponse {
        $entry = $this->assignedEntry($request, $queueEntry);

        $consultation = Consultation::query()
            ->with([
                'diagnosis',
                'prescription.items',
                'prescription.issuingDoctor:id,name',
            ])
            ->where('queue_entry_id', $entry->id)
            ->first();

        return response()->json([
            'queue_entry_id' => $entry->id,
            'consultation' => $consultation,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | PUT - Save Consultation Draft
    |--------------------------------------------------------------------------
    */

    public function saveDraft(
        Request $request,
        QueueEntry $queueEntry
    ): JsonResponse {
        $result = DB::transaction(function () use (
            $request,
            $queueEntry
        ) {
            $entry = $this->assignedEntry(
                $request,
                $queueEntry,
                true
            );

            abort_unless(
                in_array(
                    $entry->status,
                    ['called', 'in_consultation'],
                    true
                ),
                409,
                'The queue entry is not eligible for drafting.'
            );

            $data = $request->validate([
                'subjective' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],
                'objective' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],
                'assessment' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],
                'plan' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],

                'care_instructions' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],
                'follow_up_instructions' => [
                    'sometimes', 'nullable', 'string', 'max:20000',
                ],

                'diagnosis' => [
                    'sometimes', 'nullable', 'array:name,notes,reviewed',
                ],
                'diagnosis.name' => [
                    'nullable', 'string', 'max:255',
                ],
                'diagnosis.notes' => [
                    'nullable', 'string', 'max:10000',
                ],
                'diagnosis.reviewed' => [
                    'sometimes', 'boolean',
                ],

                'prescription_items' => [
                    'sometimes', 'array', 'max:20',
                ],
                'prescription_items.*' => [
                    'array:medicine,strength,dosage,frequency,duration_days,duration,instructions',
                ],
                'prescription_items.*.medicine' => [
                    'required', 'string', 'max:255',
                ],
                'prescription_items.*.strength' => [
                    'nullable', 'string', 'max:255',
                ],
                'prescription_items.*.dosage' => [
                    'nullable', 'string', 'max:255',
                ],
                'prescription_items.*.frequency' => [
                    'nullable', 'string', 'max:255',
                ],
                'prescription_items.*.duration_days' => [
                    'nullable', 'integer', 'min:1', 'max:3650',
                ],
                'prescription_items.*.duration' => [
                    'nullable', 'string', 'max:255',
                ],
                'prescription_items.*.instructions' => [
                    'nullable', 'string', 'max:10000',
                ],
            ]);

            $consultation = Consultation::query()
                ->where('queue_entry_id', $entry->id)
                ->first();

            if (!$consultation) {
                $consultation = new Consultation();
                $consultation->queue_entry_id = $entry->id;
                $consultation->doctor_id = $request->user()->id;
                $consultation->status = 'draft';
            } else {
                abort_unless(
                    (int) $consultation->doctor_id ===
                    (int) $request->user()->id,
                    403
                );

                abort_unless(
                    $consultation->status === 'draft',
                    409,
                    'This consultation is no longer a draft.'
                );

                abort_if(
                    $consultation->prescription &&
                    $consultation->prescription->status !== 'draft',
                    409,
                    'An issued prescription cannot be edited as a draft.'
                );
            }

            $consultation->fill(
                Arr::only($data, [
                    'subjective',
                    'objective',
                    'assessment',
                    'plan',
                    'care_instructions',
                    'follow_up_instructions',
                ])
            );


            $consultation->save();

            /*
            |--------------------------------------------------------------
            | Save Diagnosis
            |--------------------------------------------------------------
            */

            if (array_key_exists('diagnosis', $data)) {
                $diagnosis = $data['diagnosis'] ?? [];

                $name = trim($diagnosis['name'] ?? '');
                $notes = trim($diagnosis['notes'] ?? '');

                if ($name === '') {
                    if (
                        $notes !== '' ||
                        ($diagnosis['reviewed'] ?? false)
                    ) {
                        throw ValidationException::withMessages([
                            'diagnosis.name' =>
                                'Enter a diagnosis name before saving its details.',
                        ]);
                    }

                    $consultation->diagnosis()->delete();
                } else {
                    $consultation->diagnosis()->updateOrCreate(
                        [],
                        [
                            'name' => $name,
                            'notes' => $diagnosis['notes'] ?? null,
                            'reviewed' => $diagnosis['reviewed'] ?? false,
                        ]
                    );
                }
            }

            /*
            |--------------------------------------------------------------
            | Save Prescription Draft Items
            |--------------------------------------------------------------
            */

            if (array_key_exists('prescription_items', $data)) {
                $items = $data['prescription_items'];

                $prescription = $consultation->prescription;

                if (!$prescription && count($items) > 0) {
                    $prescription = $consultation
                        ->prescription()
                        ->create([
                            'status' => 'draft',
                        ]);
                }

                if ($prescription) {
                    abort_unless(
                        $prescription->status === 'draft',
                        409,
                        'Cannot modify an issued prescription.'
                    );

                    // Replace draft items atomically.
                    $prescription->items()->delete();

                    if (count($items) > 0) {
                        $prescription->items()->createMany($items);
                    }
                }
            }

            return $consultation->load([
                'diagnosis',
                'prescription.items',
                'prescription.issuingDoctor:id,name',
            ]);
        });

        return response()->json([
            'message' => 'Consultation draft saved successfully.',
            'consultation' => $result,
        ]);
    }


/*
|--------------------------------------------------------------------------
| POST - Complete Consultation and Queue
|--------------------------------------------------------------------------
*/

public function complete(
    Request $request,
    QueueEntry $queueEntry,
    QueueService $queueService,
    AppointmentService $appointmentService
): JsonResponse {

    // Require explicit confirmation from the doctor.
    $request->validate([
        'confirm_completion' => ['required', 'accepted'],
    ]);

    $result = DB::transaction(function () use (
         $request,
    $queueEntry,
    $queueService,
    $appointmentService
    ) {

        /*
        |--------------------------------------------------------------------------
        | Verify Assigned Doctor and Lock Queue Entry
        |--------------------------------------------------------------------------
        */

        $entry = $this->assignedEntry(
            $request,
            $queueEntry,
            true
        );

        // The patient must already be in consultation.
        abort_unless(
            $entry->status === 'in_consultation',
            409,
            'The patient must be in consultation before completion.'
        );

        /*
        |--------------------------------------------------------------------------
        | Retrieve and Lock Consultation
        |--------------------------------------------------------------------------
        */

        $consultation = Consultation::query()
            ->where('queue_entry_id', $entry->id)
            ->lockForUpdate()
            ->firstOrFail();

        /*
        |--------------------------------------------------------------------------
        | Verify Consultation Ownership
        |--------------------------------------------------------------------------
        */

        abort_unless(
            (int) $consultation->doctor_id ===
            (int) $request->user()->id,
            403
        );

        /*
        |--------------------------------------------------------------------------
        | Only Draft Consultations Can Be Completed
        |--------------------------------------------------------------------------
        */

        abort_unless(
            $consultation->status === 'draft',
            409,
            'This consultation is no longer a draft.'
        );

        /*
        |--------------------------------------------------------------------------
        | Require Complete SOAP Notes
        |--------------------------------------------------------------------------
        */

        foreach (
            ['subjective', 'objective', 'assessment', 'plan']
            as $field
        ) {
            if (
                trim((string) $consultation->{$field}) === ''
            ) {
                throw ValidationException::withMessages([
                    $field =>
                        'Complete this SOAP field before finalizing.',
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Require Reviewed Diagnosis
        |--------------------------------------------------------------------------
        */

        $diagnosis = $consultation->diagnosis;

        if (
            !$diagnosis ||
            trim((string) $diagnosis->name) === '' ||
            !(bool) $diagnosis->reviewed
        ) {
            throw ValidationException::withMessages([
                'diagnosis' =>
                    'A reviewed diagnosis is required before completion.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Complete Consultation
        |--------------------------------------------------------------------------
        */

        $consultation->status = 'completed';
        $consultation->completed_at = now('Asia/Manila');

        $consultation->save();

        /*
        |--------------------------------------------------------------------------
        | Complete Patient Queue
        |--------------------------------------------------------------------------
        |
        | Reuse the existing QueueService.
        | Both operations share the database transaction.
        |
        */

        $updatedQueue = $queueService->update(
            $entry,
            ['status' => 'completed']


        );
        $appointment = Appointment::query()
            ->whereKey($entry->appointment_id)
            ->lockForUpdate()
            ->firstOrFail();

        $updatedAppointment = $appointmentService->complete(
            $appointment
        );



/*
|--------------------------------------------------------------------------
| Return Updated Records
|--------------------------------------------------------------------------
*/

        return [
            'consultation' => $consultation->load([
                'diagnosis',
                'prescription.items',
                'prescription.issuingDoctor:id,name',
            ]),
            'queue_entry' => $updatedQueue,
            'appointment' => $updatedAppointment,
        ];
    });

    /*
    |--------------------------------------------------------------------------
    | Return JSON Response
    |--------------------------------------------------------------------------
    */

    return response()->json([
        'message' => 'Consultation, queue, and appointment completed successfully.',
        'consultation' => $result['consultation'],
        'queue_entry' => $result['queue_entry'],
        'appointment' => $result['appointment'],
    ]);
}


/*
|--------------------------------------------------------------------------
| POST - Start Doctor Consultation
|--------------------------------------------------------------------------
*/

public function start(
    Request $request,
    QueueEntry $queueEntry,
    QueueService $queueService
): JsonResponse {
    $entry = DB::transaction(function () use (
        $request,
        $queueEntry,
        $queueService
    ) {
        // Verify the assigned doctor and lock the queue entry.
        $entry = $this->assignedEntry(
            $request,
            $queueEntry,
            true
        );

        // A consultation must be called before it can start.
        abort_unless(
            $entry->status === 'called',
            409,
            'Only called patients can begin consultation.'
        );

        // Prevent reopening an already completed consultation.
        $alreadyCompleted = Consultation::query()
            ->where('queue_entry_id', $entry->id)
            ->where('status', 'completed')
            ->exists();

        abort_if(
            $alreadyCompleted,
            409,
            'A completed consultation cannot be restarted.'
        );

        // Reuse the existing queue transition rules.
        return $queueService->update(
            $entry,
            ['status' => 'in_consultation']
        );
    });

    return response()->json([
        'message' => 'Consultation started successfully.',
        'queue_entry' => $entry,
    ]);
}



}
