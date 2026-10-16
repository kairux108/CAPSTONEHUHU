<?php

namespace App\Services;

use App\Models\QueueEntry;

class QueueQueryService
{
    public function getQueue(array $filters): array
    {
        $date =
            $filters['date']
            ?? now()->toDateString();

        $query = QueueEntry::query()
            ->with([
                'appointment.patient',
                'appointment.doctor:id,name',
                'doctor:id,name',
                'creator:id,name',
            ])
            ->whereDate(
                'queue_date',
                $date
            );

        $this->applyFilters(
            $query,
            $filters
        );

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
            $filters['per_page'] ?? 20
        );

        return [
            'date' => $date,

            'queue_entries' =>
                $queueEntries->items(),

            'stats' =>
                $this->getStats($date),

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
        ];
    }

    private function applyFilters(
        $query,
        array $filters
    ): void {
        if (!empty($filters['status'])) {
            $query->where(
                'status',
                $filters['status']
            );
        }

        if (!empty($filters['priority'])) {
            $query->where(
                'priority',
                $filters['priority']
            );
        }

        if (!empty($filters['appointment_type'])) {
            $query->whereHas(
                'appointment',
                function ($appointmentQuery) use ($filters) {
                    $appointmentQuery->where(
                        'appointment_type',
                        $filters['appointment_type']
                    );
                }
            );
        }

        if (!empty($filters['doctor_id'])) {
            $query->where(
                'doctor_id',
                $filters['doctor_id']
            );
        }

        if (!empty($filters['search'])) {
            $this->applySearch(
                $query,
                trim($filters['search'])
            );
        }
    }

    private function applySearch(
        $query,
        string $search
    ): void {
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

    private function getStats(
        string $date
    ): array {
        $query = QueueEntry::whereDate(
            'queue_date',
            $date
        );

        return [
            'total' =>
                (clone $query)->count(),

            'waiting' =>
                (clone $query)
                    ->where(
                        'status',
                        'waiting'
                    )
                    ->count(),

            'called' =>
                (clone $query)
                    ->where(
                        'status',
                        'called'
                    )
                    ->count(),

            'in_consultation' =>
                (clone $query)
                    ->where(
                        'status',
                        'in_consultation'
                    )
                    ->count(),

            'completed' =>
                (clone $query)
                    ->where(
                        'status',
                        'completed'
                    )
                    ->count(),

            'emergency' =>
                (clone $query)
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
        ];
    }
}