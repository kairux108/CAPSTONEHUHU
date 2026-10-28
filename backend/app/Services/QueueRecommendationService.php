<?php

namespace App\Services;

use App\Models\QueueEntry;
use Carbon\Carbon;

class QueueRecommendationService
{
    /*
    |--------------------------------------------------------------------------
    | Queue Rules
    |--------------------------------------------------------------------------
    |
    | Online appointments receive a protected window:
    |
    | 10 minutes before the scheduled appointment.
    | 15 minutes after the scheduled appointment.
    |
    | Example:
    |
    | Appointment: 9:00 AM
    | Window Start: 8:50 AM
    | Window End:   9:15 AM
    |
    | Outside this window, the appointment does not
    | automatically receive scheduled priority.
    |
    */

    private const EARLY_WINDOW_MINUTES = 10;

    private const LATE_WINDOW_MINUTES = 15;

    private const TIMEZONE = 'Asia/Manila';

    /*
    |--------------------------------------------------------------------------
    | Get Next Recommended Patient
    |--------------------------------------------------------------------------
    */

    public function getNextRecommended(
        ?string $date = null
    ): ?array {
        $now = Carbon::now(
            self::TIMEZONE
        );

        $queueDate =
            $date ??
            $now->toDateString();

        /*
        |--------------------------------------------------------------------------
        | Get Waiting Patients
        |--------------------------------------------------------------------------
        */

        $waitingPatients = QueueEntry::query()
            ->with([
                'appointment.patient',
                'appointment.doctor:id,name',
                'doctor:id,name',
            ])
            ->whereDate(
                'queue_date',
                $queueDate
            )
            ->where(
                'status',
                'waiting'
            )
            ->orderBy(
                'queued_at'
            )
            ->get();

        if ($waitingPatients->isEmpty()) {
            return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Rule 1:
        | Online Appointment Within Protected Window
        |--------------------------------------------------------------------------
        |
        | Example:
        |
        | Appointment = 8:30 AM
        | Window Start = 8:20 AM
        | Window End   = 8:45 AM
        |
        | Online appointments receive scheduled priority
        | only while the current time is within this window.
        |
        */

        $dueOnlinePatient = $waitingPatients
            ->filter(
                function ($entry) use ($now) {
                    return
                        $entry->appointment
                            ?->appointment_type ===
                            'online'
                        &&
                        $this->isOnlineAppointmentDue(
                            $entry,
                            $now
                        );
                }
            )
            ->sortBy(
                function ($entry) {
                    return $this
                        ->getAppointmentDateTime(
                            $entry
                        )
                        ?->timestamp
                        ?? PHP_INT_MAX;
                }
            )
            ->first();

        if ($dueOnlinePatient) {
            $appointmentDateTime =
                $this->getAppointmentDateTime(
                    $dueOnlinePatient
                );

            return $this->buildRecommendation(
                entry: $dueOnlinePatient,
                type: 'scheduled_due',
                reason:
                    'Scheduled appointment is within its protected appointment window.',
                appointmentDateTime:
                    $appointmentDateTime
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Rule 2:
        | Longest-Waiting Walk-In Patient
        |--------------------------------------------------------------------------
        |
        | If no online appointment is currently within
        | its protected window, recommend the walk-in
        | patient who entered the queue first.
        |
        */

        $walkInPatient = $waitingPatients
            ->first(
                function ($entry) {
                    return
                        $entry->appointment
                            ?->appointment_type ===
                            'walk_in';
                }
            );

        if ($walkInPatient) {
            return $this->buildRecommendation(
                entry: $walkInPatient,
                type: 'walk_in_waiting',
                reason:
                    'No scheduled appointment is currently due. This is the longest-waiting walk-in patient.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Rule 3:
        | Online Patients Only
        |--------------------------------------------------------------------------
        |
        | If no walk-in patients are waiting,
        | recommend the online patient with the
        | earliest scheduled appointment.
        |
        | This fallback also covers online appointments
        | whose protected window has already expired.
        |
        */

        $nextOnlinePatient = $waitingPatients
            ->filter(
                function ($entry) {
                    return
                        $entry->appointment
                            ?->appointment_type ===
                            'online';
                }
            )
            ->sortBy(
                function ($entry) {
                    return $this
                        ->getAppointmentDateTime(
                            $entry
                        )
                        ?->timestamp
                        ?? PHP_INT_MAX;
                }
            )
            ->first();

        if ($nextOnlinePatient) {
            $appointmentDateTime =
                $this->getAppointmentDateTime(
                    $nextOnlinePatient
                );

            return $this->buildRecommendation(
                entry: $nextOnlinePatient,
                type: 'online_only',
                reason:
                    'No walk-in patients are waiting. This is the earliest online appointment.',
                appointmentDateTime:
                    $appointmentDateTime
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Fallback:
        | Longest-Waiting Patient
        |--------------------------------------------------------------------------
        */

        $fallbackPatient =
            $waitingPatients->first();

        return $this->buildRecommendation(
            entry: $fallbackPatient,
            type: 'waiting',
            reason:
                'This patient has been waiting the longest.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Online Appointment Protected Window
    |--------------------------------------------------------------------------
    |
    | Appointment: 9:00 AM
    |
    | Window Start: 8:50 AM
    | Window End:   9:15 AM
    |
    | The current time must be within both boundaries.
    |
    */

    private function isOnlineAppointmentDue(
        QueueEntry $entry,
        Carbon $now
    ): bool {
        $appointmentDateTime =
            $this->getAppointmentDateTime(
                $entry
            );

        if (!$appointmentDateTime) {
            return false;
        }

        /*
         * Protected window begins 10 minutes
         * before the appointment time.
         */

        $protectedWindowStart =
            $appointmentDateTime
                ->copy()
                ->subMinutes(
                    self::EARLY_WINDOW_MINUTES
                );

        /*
         * Protected window ends 15 minutes
         * after the appointment time.
         */

        $protectedWindowEnd =
            $appointmentDateTime
                ->copy()
                ->addMinutes(
                    self::LATE_WINDOW_MINUTES
                );

        /*
         * Scheduled priority is available
         * only within the protected window.
         */

        return $now->greaterThanOrEqualTo(
            $protectedWindowStart
        ) && $now->lessThanOrEqualTo(
            $protectedWindowEnd
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Build Appointment Date + Time
    |--------------------------------------------------------------------------
    */

    private function getAppointmentDateTime(
        QueueEntry $entry
    ): ?Carbon {
        $appointment =
            $entry->appointment;

        if (
            !$appointment ||
            !$appointment->appointment_date ||
            !$appointment->appointment_time
        ) {
            return null;
        }

        $date = Carbon::parse(
            $appointment->appointment_date,
            self::TIMEZONE
        )->format('Y-m-d');

        $time = Carbon::parse(
            $appointment->appointment_time
        )->format('H:i:s');

        return Carbon::createFromFormat(
            'Y-m-d H:i:s',
            "{$date} {$time}",
            self::TIMEZONE
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Build Recommendation Response
    |--------------------------------------------------------------------------
    */

    private function buildRecommendation(
        QueueEntry $entry,
        string $type,
        string $reason,
        ?Carbon $appointmentDateTime = null
    ): array {
        return [
            'type' => $type,

            'reason' => $reason,

            'protected_window_minutes' =>
                self::EARLY_WINDOW_MINUTES,

            'appointment_time' =>
                $appointmentDateTime
                    ?->format('H:i:s'),

            'protected_window_start' =>
                $appointmentDateTime
                    ?->copy()
                    ->subMinutes(
                        self::EARLY_WINDOW_MINUTES
                    )
                    ->format('H:i:s'),

            'queue_entry' => $entry,
        ];
    }
}
