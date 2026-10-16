<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    private const TIMEZONE =
        'Asia/Manila';

    public function create(
        array $data,
        User $user
    ): Appointment {
        $this->ensureDoctorAvailable(
            doctorId:
                $data['doctor_id'] ?? null,

            date:
                $data['appointment_date'],

            time:
                $data['appointment_time']
        );

        $appointment =
            Appointment::create([
                'appointment_number' =>
                    $this
                        ->generateAppointmentNumber(),

                'patient_id' =>
                    $data['patient_id'],

                'doctor_id' =>
                    $data['doctor_id']
                    ?? null,

                'created_by' =>
                    $user->id,

                'appointment_date' =>
                    $data['appointment_date'],

                'appointment_time' =>
                    $data['appointment_time'],

                'appointment_type' =>
                    $data['appointment_type'],

                'reason_for_visit' =>
                    $data['reason_for_visit']
                    ?? null,

                'status' =>
                    'scheduled',
            ]);

        return $this->loadRelationships(
            $appointment
        );
    }

    public function update(
        Appointment $appointment,
        array $data
    ): Appointment {
        $doctorId =
            array_key_exists(
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
            doctorId:
                $doctorId,

            date:
                $appointmentDate,

            time:
                $appointmentTime,

            ignoreAppointmentId:
                $appointment->id
        );

        $appointment->update(
            $data
        );

        return $this->loadRelationships(
            $appointment
        );
    }

    public function checkIn(
        Appointment $appointment
    ): Appointment {
        /*
        |--------------------------------------------------------------------------
        | Only Scheduled Appointments
        |--------------------------------------------------------------------------
        */

        if (
            $appointment->status !==
            'scheduled'
        ) {
            throw ValidationException::withMessages([
                'status' =>
                    'Only scheduled appointments can be checked in.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Appointment Must Be Today
        |--------------------------------------------------------------------------
        */

        $today =
            Carbon::now(
                self::TIMEZONE
            )->toDateString();

        $appointmentDate =
            Carbon::parse(
                $appointment
                    ->appointment_date
            )->toDateString();

        if (
            $appointmentDate !==
            $today
        ) {
            throw ValidationException::withMessages([
                'appointment_date' =>
                    'This appointment cannot be checked in because it is not scheduled for today.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Check In
        |--------------------------------------------------------------------------
        */

        $appointment->update([
            'status' =>
                'checked_in',

            'checked_in_at' =>
                now(),
        ]);

        return $this->loadRelationships(
            $appointment
        );
    }

    private function ensureDoctorAvailable(
        $doctorId,
        $date,
        $time,
        ?int $ignoreAppointmentId = null
    ): void {
        if (empty($doctorId)) {
            return;
        }

        $query =
            Appointment::query()
                ->where(
                    'doctor_id',
                    $doctorId
                )
                ->whereDate(
                    'appointment_date',
                    $date
                )
                ->whereTime(
                    'appointment_time',
                    $time
                )
                ->whereNotIn(
                    'status',
                    [
                        'cancelled',
                        'no_show',
                    ]
                );

        if ($ignoreAppointmentId) {
            $query->where(
                'id',
                '!=',
                $ignoreAppointmentId
            );
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'appointment_time' =>
                    'The selected doctor already has an appointment at this date and time.',
            ]);
        }
    }

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