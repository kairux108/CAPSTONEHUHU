<?php

namespace App\Services;

use App\Models\Patient;

class PatientQueryService
{
    public function getPatients(
        array $filters
    ): array {
        $query =
            Patient::query();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (!empty($filters['search'])) {
            $search =
                trim(
                    $filters['search']
                );

            $query->where(
                function ($query) use ($search) {
                    $query
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
                            'email',
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

        /*
        |--------------------------------------------------------------------------
        | Status
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

        /*
        |--------------------------------------------------------------------------
        | Sex
        |--------------------------------------------------------------------------
        */

        if (
            !empty($filters['sex']) &&
            $filters['sex'] !== 'all'
        ) {
            $query->whereRaw(
                'LOWER(sex) = ?',
                [
                    strtolower(
                        $filters['sex']
                    ),
                ]
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Age Group
        |--------------------------------------------------------------------------
        */

        if (
            !empty($filters['age_group']) &&
            $filters['age_group'] !== 'all'
        ) {
            $this->applyAgeGroup(
                $query,
                $filters['age_group']
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        switch (
            $filters['sort'] ?? 'name'
        ) {
            case 'newest':
                $query->latest();
                break;

            case 'oldest':
                $query->oldest();
                break;

            default:
                $query
                    ->orderBy('last_name')
                    ->orderBy('first_name');
                break;
        }

        $patients =
            $query->paginate(20);

        return [
            'patients' =>
                $patients->items(),

            'stats' =>
                $this->getStats(),

            'pagination' => [
                'current_page' =>
                    $patients->currentPage(),

                'last_page' =>
                    $patients->lastPage(),

                'per_page' =>
                    $patients->perPage(),

                'total' =>
                    $patients->total(),
            ],
        ];
    }

    private function applyAgeGroup(
        $query,
        string $ageGroup
    ): void {
        if ($ageGroup === 'child') {
            $query->whereDate(
                'birth_date',
                '>',
                now()
                    ->subYears(18)
                    ->toDateString()
            );

            return;
        }

        if ($ageGroup === 'adult') {
            $query
                ->whereDate(
                    'birth_date',
                    '<=',
                    now()
                        ->subYears(18)
                        ->toDateString()
                )
                ->whereDate(
                    'birth_date',
                    '>',
                    now()
                        ->subYears(60)
                        ->toDateString()
                );

            return;
        }

        if ($ageGroup === 'senior') {
            $query->whereDate(
                'birth_date',
                '<=',
                now()
                    ->subYears(60)
                    ->toDateString()
            );
        }
    }

    private function getStats(): array
    {
        return [
            'total' =>
                Patient::count(),

            'active' =>
                Patient::where(
                    'status',
                    'active'
                )->count(),

            'inactive' =>
                Patient::where(
                    'status',
                    'inactive'
                )->count(),

            'new_this_month' =>
                Patient::whereBetween(
                    'created_at',
                    [
                        now()
                            ->startOfMonth(),

                        now()
                            ->endOfMonth(),
                    ]
                )->count(),
        ];
    }
}