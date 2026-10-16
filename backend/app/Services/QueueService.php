<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\QueueEntry;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QueueService
{
    public function create(
        array $data,
        User $user
    ): QueueEntry {
        $appointment =
            Appointment::findOrFail(
                $data['appointment_id']
            );

        $this->validateAppointment(
            $appointment
        );

        $this->validateNotAlreadyQueued(
            $appointment
        );

        $priority =
            $data['priority']
            ?? 'normal';

        $this->validatePriority(
            $priority,
            $data['priority_reason'] ?? null
        );

        $queueEntry = DB::transaction(
            function () use (
                $data,
                $appointment,
                $priority,
                $user
            ) {
                return QueueEntry::create([
                    'appointment_id' =>
                        $appointment->id,

                    'doctor_id' =>
                        $appointment->doctor_id,

                    'created_by' =>
                        $user->id,

                    'queue_number' =>
                        $this->generateQueueNumber(),

                    'queue_date' =>
                        now()->toDateString(),

                    'priority' =>
                        $priority,

                    'priority_reason' =>
                        $data['priority_reason']
                        ?? null,

                    'status' =>
                        'waiting',

                    'doctor_available_at' =>
                        $data['doctor_available_at']
                        ?? null,

                    'estimated_wait_minutes' =>
                        $data['estimated_wait_minutes']
                        ?? null,

                    'queued_at' =>
                        now(),
                ]);
            }
        );

        return $this->loadRelationships(
            $queueEntry
        );
    }

    public function update(
        QueueEntry $queueEntry,
        array $data
    ): QueueEntry {
        $this->validateDoctor(
            $data
        );

        $priority =
            $data['priority']
            ?? $queueEntry->priority;

        $priorityReason =
            $data['priority_reason']
            ?? $queueEntry->priority_reason;

        $this->validatePriority(
            $priority,
            $priorityReason
        );

        if ($priority === 'normal') {
            $data['priority_reason'] = null;
        }

        $queueEntry->update(
            $data
        );

        return $this->loadRelationships(
            $queueEntry
        );
    }

    private function validateAppointment(
        Appointment $appointment
    ): void {
        if (
            $appointment
                ->appointment_date
                ->toDateString()
            !== now()->toDateString()
        ) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'Only appointments scheduled for today can be added to today\'s queue.',
            ]);
        }

        if (
            $appointment->status !==
            'checked_in'
        ) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'The patient must be checked in before being added to the queue.',
            ]);
        }
    }

    private function validateNotAlreadyQueued(
        Appointment $appointment
    ): void {
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
    }

    private function validateDoctor(
        array $data
    ): void {
        if (
            !array_key_exists(
                'doctor_id',
                $data
            )
            ||
            $data['doctor_id'] === null
        ) {
            return;
        }

        $doctor = User::find(
            $data['doctor_id']
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

    private function validatePriority(
        string $priority,
        ?string $reason
    ): void {
        if (
            in_array(
                $priority,
                [
                    'priority',
                    'emergency',
                ],
                true
            )
            &&
            empty(
                trim($reason ?? '')
            )
        ) {
            throw ValidationException::withMessages([
                'priority_reason' =>
                    'Please provide a reason for priority or emergency cases.',
            ]);
        }
    }

    private function loadRelationships(
        QueueEntry $queueEntry
    ): QueueEntry {
        $queueEntry->load([
            'appointment.patient',
            'appointment.doctor:id,name',
            'doctor:id,name',
            'creator:id,name',
        ]);

        return $queueEntry;
    }

    private function generateQueueNumber(): string
    {
        $date =
            now()->format('Ymd');

        $prefix =
            "Q-{$date}-";

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

            $nextNumber =
                ((int) end($parts)) + 1;
        }

        return sprintf(
            'Q-%s-%03d',
            $date,
            $nextNumber
        );
    }
}