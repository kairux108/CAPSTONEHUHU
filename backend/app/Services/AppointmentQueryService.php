<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\User;

class AppointmentQueryService
{
    public function getAppointments(
        array $filters
    ): array {
        $query = Appointment::with([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {
            $search = trim(
                $filters['search']
            );

            $query->where(
                function ($query) use ($search) {
                    $query
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
                                        'patient_number',
                                        'ilike',
                                        "%{$search}%"
                                    )
                                    ->orWhere(
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
                                        'phone_number',
                                        'ilike',
                                        "%{$search}%"
                                    );
                            }
                        );
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        if (
            !empty($filters['status']) &&
            $filters['status'] !== 'all'
        ) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        if (
            !empty($filters['type']) &&
            $filters['type'] !== 'all'
        ) {
            $query->where(
                'appointment_type',
                $filters['type']
            );
        }

        if (!empty($filters['date'])) {
            $query->whereDate(
                'appointment_date',
                $filters['date']
            );
        }

        if (!empty($filters['doctor_id'])) {
            $query->where(
                'doctor_id',
                $filters['doctor_id']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $query
            ->orderBy('appointment_date')
            ->orderBy('appointment_time');

        $appointments =
            $query->paginate(20);

        return [
            'appointments' =>
                $appointments->items(),

            'stats' =>
                $this->getStats(),

            'pagination' => [
                'current_page' =>
                    $appointments->currentPage(),

                'last_page' =>
                    $appointments->lastPage(),

                'per_page' =>
                    $appointments->perPage(),

                'total' =>
                    $appointments->total(),
            ],
        ];
    }

    public function getDoctors()
    {
        return User::query()
            ->where(
                'role',
                'doctor'
            )
            ->where(
                'status',
                'active'
            )
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);
    }

    private function getStats(): array
    {
        $today =
            now()->toDateString();

        return [
            'total_today' =>
                Appointment::whereDate(
                    'appointment_date',
                    $today
                )->count(),

            'scheduled_today' =>
                Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where(
                        'status',
                        'scheduled'
                    )
                    ->count(),

            'checked_in_today' =>
                Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where(
                        'status',
                        'checked_in'
                    )
                    ->count(),

            'walk_in_today' =>
                Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where(
                        'appointment_type',
                        'walk_in'
                    )
                    ->count(),

            'online_today' =>
                Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where(
                        'appointment_type',
                        'online'
                    )
                    ->count(),
        ];
    }
}