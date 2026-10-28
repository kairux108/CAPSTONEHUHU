<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\DoctorAvailability;
use App\Models\DoctorUnavailability;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    private const TIMEZONE = 'Asia/Manila';

    /*
    |--------------------------------------------------------------------------
    | Create Appointment
    |--------------------------------------------------------------------------
    */

    public function create(
        array $data,
        User $user
    ): Appointment {
        $this->ensureDoctorAvailable(
            doctorId: $data['doctor_id'] ?? null,
            date: $data['appointment_date'],
            time: $data['appointment_time']
        );

        $appointment = Appointment::create([
            'appointment_number' =>
                $this->generateAppointmentNumber(),

            'patient_id' => $data['patient_id'],

            'doctor_id' =>
                $data['doctor_id'] ?? null,

            'created_by' => $user->id,

            'appointment_date' =>
                $data['appointment_date'],

            'appointment_time' =>
                $data['appointment_time'],

            'appointment_type' =>
                $data['appointment_type'],

            'reason_for_visit' =>
                $data['reason_for_visit'] ?? null,

            'status' => 'scheduled',
        ]);

        return $this->loadRelationships(
            $appointment
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Update Appointment
    |--------------------------------------------------------------------------
    */

    public function update(
        Appointment $appointment,
        array $data
    ): Appointment {
        $doctorId = array_key_exists(
            'doctor_id',
            $data
        )
            ? $data['doctor_id']
            : $appointment->doctor_id;

        $appointmentDate =
            $data['appointment_date']
            ?? $appointment->appointment_date;

        $appointmentTime =
            $data['appointment_time']
            ?? $appointment->appointment_time;

        $this->ensureDoctorAvailable(
            doctorId: $doctorId,
            date: $appointmentDate,
            time: $appointmentTime,
            ignoreAppointmentId: $appointment->id
        );

        $appointment->update($data);

        return $this->loadRelationships(
            $appointment
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Check In Patient
    |--------------------------------------------------------------------------
    */

    public function checkIn(
        Appointment $appointment
    ): Appointment {
        if (
            $appointment->status !== 'scheduled'
        ) {
            throw ValidationException::withMessages([
                'status' =>
                    'Only scheduled appointments can be checked in.',
            ]);
        }

        $today = Carbon::now(
            self::TIMEZONE
        )->toDateString();

        $appointmentDate = Carbon::parse(
            $appointment->appointment_date
        )->toDateString();

        if ($appointmentDate !== $today) {
            throw ValidationException::withMessages([
                'appointment_date' =>
                    'This appointment cannot be checked in because it is not scheduled for today.',
            ]);
        }

        $appointment->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return $this->loadRelationships(
            $appointment
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Doctor Availability
    |--------------------------------------------------------------------------
    |
    | Checks:
    |
    | 1. Doctor's weekly working schedule
    | 2. Doctor's working hours
    | 3. Doctor's unavailable periods
    | 4. Conflicting appointments
    |
    | Unassigned walk-ins remain supported.
    |
    */

    private function ensureDoctorAvailable(
        $doctorId,
        $date,
        $time,
        ?int $ignoreAppointmentId = null
    ): void {
        /*
         * An appointment may be registered without
         * assigning a doctor immediately.
         */
        if (empty($doctorId)) {
            return;
        }

        /*
         * Normalize date and time.
         */
        $dateString = $date instanceof \DateTimeInterface
            ? $date->format('Y-m-d')
            : Carbon::parse(
                $date,
                self::TIMEZONE
            )->format('Y-m-d');

        $timeString = $time instanceof \DateTimeInterface
            ? $time->format('H:i:s')
            : (string) $time;

        $requestedStart = Carbon::parse(
            "{$dateString} {$timeString}",
            self::TIMEZONE
        );

        /*
        |--------------------------------------------------------------------------
        | Check Weekly Doctor Schedule
        |--------------------------------------------------------------------------
        */

        $schedules = DoctorAvailability::query()
            ->where('doctor_id', $doctorId)
            ->where(
                'day_of_week',
                $requestedStart->dayOfWeek
            )
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        if ($schedules->isEmpty()) {
            throw ValidationException::withMessages([
                'doctor_id' =>
                    'The selected doctor has no working schedule on this date.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Check Working Hours
        |--------------------------------------------------------------------------
        |
        | Staff walk-in times may be any minute
        | within the doctor's available hours.
        |
        | The full estimated slot must fit inside
        | the doctor's working schedule.
        |
        */

        $matchingSchedule = $schedules->first(
            function ($schedule) use (
                $requestedStart,
                $dateString
            ) {
                $duration = (int)
                    $schedule->slot_duration_minutes;

                if ($duration <= 0) {
                    return false;
                }

                $scheduleStart = Carbon::parse(
                    "{$dateString} {$schedule->start_time}",
                    self::TIMEZONE
                );

                $scheduleEnd = Carbon::parse(
                    "{$dateString} {$schedule->end_time}",
                    self::TIMEZONE
                );

                $requestedEnd = $requestedStart
                    ->copy()
                    ->addMinutes($duration);

                return
                    $requestedStart->greaterThanOrEqualTo(
                        $scheduleStart
                    )
                    &&
                    $requestedEnd->lessThanOrEqualTo(
                        $scheduleEnd
                    );
            }
        );

        if (!$matchingSchedule) {
            throw ValidationException::withMessages([
                'appointment_time' =>
                    'The selected appointment time is outside the doctor\'s available working hours.',
            ]);
        }

        $duration = (int)
            $matchingSchedule->slot_duration_minutes;

        $requestedEnd = $requestedStart
            ->copy()
            ->addMinutes($duration);

        /*
        |--------------------------------------------------------------------------
        | Check Doctor Unavailability
        |--------------------------------------------------------------------------
        |
        | Includes unavailable periods recorded
        | for the doctor.
        |
        */

        $isUnavailable = DoctorUnavailability::query()
            ->where('doctor_id', $doctorId)
            ->where(
                'start_at',
                '<',
                $requestedEnd
            )
            ->where(
                'end_at',
                '>',
                $requestedStart
            )
            ->exists();

        if ($isUnavailable) {
            throw ValidationException::withMessages([
                'doctor_id' =>
                    'The selected doctor is unavailable during this appointment time.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Check Existing Appointment Conflicts
        |--------------------------------------------------------------------------
        |
        | Prevent overlapping appointments,
        | not just appointments with identical times.
        |
        */

        $query = Appointment::query()
            ->where('doctor_id', $doctorId)
            ->whereDate(
                'appointment_date',
                $dateString
            )
            ->whereNotIn('status', [
                'cancelled',
                'no_show',
            ]);

        if ($ignoreAppointmentId !== null) {
            $query->where(
                'id',
                '!=',
                $ignoreAppointmentId
            );
        }

        $existingAppointments = $query->get();

        foreach ($existingAppointments as $existing) {
            $existingStart = Carbon::parse(
                "{$dateString} {$existing->appointment_time}",
                self::TIMEZONE
            );

            /*
             * Current assumption:
             * each appointment occupies one schedule slot.
             */
            $existingEnd = $existingStart
                ->copy()
                ->addMinutes($duration);

            $overlaps =
                $requestedStart->lessThan(
                    $existingEnd
                )
                &&
                $requestedEnd->greaterThan(
                    $existingStart
                );

            if ($overlaps) {
                throw ValidationException::withMessages([
                    'appointment_time' =>
                        'The selected doctor already has an overlapping appointment at this time.',
                ]);
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Load Appointment Relationships
    |--------------------------------------------------------------------------
    */

    private function loadRelationships(
        Appointment $appointment
    ): Appointment {
        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return $appointment;
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Appointment Number
    |--------------------------------------------------------------------------
    */

    private function generateAppointmentNumber(): string
    {
        do {
            $number =
                'APT-' .
                Str::upper(
                    Str::random(8)
                );
        } while (
            Appointment::where(
                'appointment_number',
                $number
            )->exists()
        );

        return $number;
    }
}
