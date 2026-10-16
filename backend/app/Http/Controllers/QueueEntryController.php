<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QueueEntryController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'date' => [
                'nullable',
                'date',
            ],

            'status' => [
                'nullable',
                'in:waiting,called,in_consultation,completed,cancelled',
            ],

            'priority' => [
                'nullable',
                'in:normal,priority,emergency',
            ],

            'doctor_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ]);

        $date = $validated['date'] ?? now()->toDateString();

        $query = QueueEntry::query()
            ->with([
                'appointment.patient',
                'appointment.doctor:id,name',
                'doctor:id,name',
                'creator:id,name',
            ])
            ->whereDate('queue_date', $date);

        if (!empty($validated['status'])) {
            $query->where(
                'status',
                $validated['status']
            );
        }

        if (!empty($validated['priority'])) {
            $query->where(
                'priority',
                $validated['priority']
            );
        }

        if (!empty($validated['doctor_id'])) {
            $query->where(
                'doctor_id',
                $validated['doctor_id']
            );
        }

        if (!empty($validated['search'])) {
            $search = trim(
                $validated['search']
            );

            $query->where(
                function ($query) use ($search) {
                    $query
                        ->where(
                            'queue_number',
                            'ilike',
                            "%{$search}%"
                        )
                        ->orWhereHas(
                            'appointment',
                            function ($appointmentQuery) use ($search) {
                                $appointmentQuery
                                    ->where(
                                        'appointment_number',
                                        'ilike',
                                        "%{$search}%"
                                    )
                                    ->orWhereHas(
                                        'patient',
                                        function ($patientQuery) use ($search) {
                                            $patientQuery
                                                ->where(
                                                    'first_name',
                                                    'ilike',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'middle_name',
                                                    'ilike',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'last_name',
                                                    'ilike',
                                                    "%{$search}%"
                                                )
                                                ->orWhere(
                                                    'patient_number',
                                                    'ilike',
                                                    "%{$search}%"
                                                );
                                        }
                                    );
                            }
                        );
                }
            );
        }

        $query
            ->orderByRaw("
                CASE priority
                    WHEN 'emergency' THEN 1
                    WHEN 'priority' THEN 2
                    ELSE 3
                END
            ")
            ->orderBy('queued_at');

        $queueEntries = $query->paginate(
            $validated['per_page'] ?? 20
        );

        $statsQuery = QueueEntry::whereDate(
            'queue_date',
            $date
        );

        return response()->json([
            'queue_entries' =>
                $queueEntries->items(),

            'stats' => [
                'total' =>
                    (clone $statsQuery)->count(),

                'waiting' =>
                    (clone $statsQuery)
                        ->where(
                            'status',
                            'waiting'
                        )
                        ->count(),

                'called' =>
                    (clone $statsQuery)
                        ->where(
                            'status',
                            'called'
                        )
                        ->count(),

                'in_consultation' =>
                    (clone $statsQuery)
                        ->where(
                            'status',
                            'in_consultation'
                        )
                        ->count(),

                'completed' =>
                    (clone $statsQuery)
                        ->where(
                            'status',
                            'completed'
                        )
                        ->count(),

                'emergency' =>
                    (clone $statsQuery)
                        ->where(
                            'priority',
                            'emergency'
                        )
                        ->whereIn(
                            'status',
                            [
                                'waiting',
                                'called',
                                'in_consultation',
                            ]
                        )
                        ->count(),
            ],

            'pagination' => [
                'current_page' =>
                    $queueEntries->currentPage(),

                'last_page' =>
                    $queueEntries->lastPage(),

                'per_page' =>
                    $queueEntries->perPage(),

                'total' =>
                    $queueEntries->total(),
            ],
        ]);
    }

    public function show(
        QueueEntry $queueEntry
    ) {
        $queueEntry->load([
            'appointment.patient',
            'appointment.doctor:id,name',
            'doctor:id,name',
            'creator:id,name',
        ]);

        return response()->json([
            'queue_entry' =>
                $queueEntry,
        ]);
    }

    public function store(
        Request $request
    ) {
        $validated = $request->validate([
            'appointment_id' => [
                'required',
                'integer',
                'exists:appointments,id',
            ],

            'priority' => [
                'nullable',
                'in:normal,priority,emergency',
            ],

            'priority_reason' => [
                'nullable',
                'string',
                'max:500',
            ],

            'doctor_available_at' => [
                'nullable',
                'date',
            ],

            'estimated_wait_minutes' => [
                'nullable',
                'integer',
                'min:0',
                'max:1440',
            ],
        ]);

        $appointment = Appointment::findOrFail(
            $validated['appointment_id']
        );

        /*
        |--------------------------------------------------------------------------
        | Appointment Must Be For Today
        |--------------------------------------------------------------------------
        */

        if (
            $appointment
                ->appointment_date
                ->toDateString() !==
            now()->toDateString()
        ) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'Only appointments scheduled for today can be added to today\'s queue.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Patient Must Be Checked In
        |--------------------------------------------------------------------------
        */

        if (
            $appointment->status !==
            'checked_in'
        ) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'The patient must be checked in before being added to the queue.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Queue Entry
        |--------------------------------------------------------------------------
        */

        $alreadyQueued =
            QueueEntry::where(
                'appointment_id',
                $appointment->id
            )->exists();

        if ($alreadyQueued) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'This appointment is already in the queue.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Priority
        |--------------------------------------------------------------------------
        */

        $priority =
            $validated['priority'] ??
            'normal';

        if (
            in_array(
                $priority,
                [
                    'priority',
                    'emergency',
                ],
                true
            ) &&
            empty(
                trim(
                    $validated[
                        'priority_reason'
                    ] ?? ''
                )
            )
        ) {
            throw ValidationException::withMessages([
                'priority_reason' =>
                    'Please provide a reason for priority or emergency cases.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Create Queue Entry
        |--------------------------------------------------------------------------
        */

        $queueEntry = DB::transaction(
            function () use (
                $request,
                $validated,
                $appointment,
                $priority
            ) {
                $queueNumber =
                    $this->generateQueueNumber();

                return QueueEntry::create([
                    'appointment_id' =>
                        $appointment->id,

                    'doctor_id' =>
                        $appointment->doctor_id,

                    'created_by' =>
                        $request->user()->id,

                    'queue_number' =>
                        $queueNumber,

                    'queue_date' =>
                        now()->toDateString(),

                    'priority' =>
                        $priority,

                    'priority_reason' =>
                        $validated[
                            'priority_reason'
                        ] ?? null,

                    'status' =>
                        'waiting',

                    'doctor_available_at' =>
                        $validated[
                            'doctor_available_at'
                        ] ?? null,

                    'estimated_wait_minutes' =>
                        $validated[
                            'estimated_wait_minutes'
                        ] ?? null,

                    'queued_at' =>
                        now(),
                ]);
            }
        );

        $queueEntry->load([
            'appointment.patient',
            'appointment.doctor:id,name',
            'doctor:id,name',
            'creator:id,name',
        ]);

        return response()->json([
            'message' =>
                'Patient added to queue successfully.',

            'queue_entry' =>
                $queueEntry,
        ], 201);
    }

    public function update(
        Request $request,
        QueueEntry $queueEntry
    ) {
        $validated = $request->validate([
            'priority' => [
                'sometimes',
                'in:normal,priority,emergency',
            ],

            'priority_reason' => [
                'nullable',
                'string',
                'max:500',
            ],

            'doctor_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'doctor_available_at' => [
                'nullable',
                'date',
            ],

            'estimated_wait_minutes' => [
                'nullable',
                'integer',
                'min:0',
                'max:1440',
            ],

            'status' => [
                'sometimes',
                'in:waiting,cancelled',
            ],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Validate Doctor
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'doctor_id',
                $validated
            ) &&
            $validated['doctor_id'] !== null
        ) {
            $doctor = User::find(
                $validated['doctor_id']
            );

            if (
                !$doctor ||
                $doctor->role !== 'doctor' ||
                $doctor->status !== 'active'
            ) {
                throw ValidationException::withMessages([
                    'doctor_id' =>
                        'The selected doctor must be an active doctor.',
                ]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Priority Reason
        |--------------------------------------------------------------------------
        */

        $newPriority =
            $validated['priority'] ??
            $queueEntry->priority;

        $newPriorityReason =
            $validated['priority_reason'] ??
            $queueEntry->priority_reason;

        if (
            in_array(
                $newPriority,
                [
                    'priority',
                    'emergency',
                ],
                true
            ) &&
            empty(
                trim(
                    $newPriorityReason ?? ''
                )
            )
        ) {
            throw ValidationException::withMessages([
                'priority_reason' =>
                    'Please provide a reason for priority or emergency cases.',
            ]);
        }

        if (
            $newPriority ===
            'normal'
        ) {
            $validated[
                'priority_reason'
            ] = null;
        }

        /*
        |--------------------------------------------------------------------------
        | Update Queue Entry
        |--------------------------------------------------------------------------
        */

        $queueEntry->update(
            $validated
        );

        $queueEntry->load([
            'appointment.patient',
            'appointment.doctor:id,name',
            'doctor:id,name',
            'creator:id,name',
        ]);

        return response()->json([
            'message' =>
                'Queue entry updated successfully.',

            'queue_entry' =>
                $queueEntry,
        ]);
    }

    private function generateQueueNumber(): string
    {
        $date = now()->format('Ymd');

        $prefix = "Q-{$date}-";

        $lastQueue =
            QueueEntry::whereDate(
                'queue_date',
                now()->toDateString()
            )
                ->where(
                    'queue_number',
                    'like',
                    "{$prefix}%"
                )
                ->orderByDesc('id')
                ->first();

        $nextNumber = 1;

        if ($lastQueue) {
            $parts = explode(
                '-',
                $lastQueue->queue_number
            );

            $lastNumber =
                (int) end($parts);

            $nextNumber =
                $lastNumber + 1;
        }

        return sprintf(
            'Q-%s-%03d',
            $date,
            $nextNumber
        );
    }
}