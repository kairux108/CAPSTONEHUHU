<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Patient;

class PatientAppointmentService
{
    public function getUpcoming(
        Patient $patient
    ): ?Appointment {
        $now = now();

        return Appointment::with([
            'doctor:id,name,role',
        ])
            ->where(
                'patient_id',
                $patient->id
            )
            ->where(
                'status',
                'scheduled'
            )
            ->where(function ($query) use ($now) {
                $query
                    ->whereDate(
                        'appointment_date',
                        '>',
                        $now->toDateString()
                    )
                    ->orWhere(function ($query) use ($now) {
                        $query
                            ->whereDate(
                                'appointment_date',
                                $now->toDateString()
                            )
                            ->whereTime(
                                'appointment_time',
                                '>=',
                                $now->format('H:i:s')
                            );
                    });
            })
            ->orderBy(
                'appointment_date'
            )
            ->orderBy(
                'appointment_time'
            )
            ->first();
    }
}
