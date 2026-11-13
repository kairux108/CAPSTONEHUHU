<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientIndexRequest;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;

class DoctorPatientController extends Controller
{
    public function index(
        PatientIndexRequest $request
    ): JsonResponse {
        $doctor = $request->user();

        abort_unless(
            $doctor &&
            $doctor->role === 'doctor' &&
            $doctor->status === 'active',
            403,
            'Active doctor access only.'
        );

        $today = now('Asia/Manila')->toDateString();
        $filters = $request->validated();

        /*
         * Only patients assigned to this doctor today.
         * Keep the same assignment rule used by
         * PatientMedicalHistoryController.
         */
        $baseQuery = Patient::query()
            ->whereIn(
                'id',
                Appointment::query()
                    ->select('patient_id')
                    ->where('doctor_id', $doctor->id)
                    ->whereDate('appointment_date', $today)
                    ->whereIn('status', [
                        'scheduled',
                        'checked_in',
                        'completed',
                    ])
            );

        /*
         * Statistics are scoped to this doctor's
         * assigned patients, not the entire clinic.
         */
        $stats = [
            'total' => (clone $baseQuery)->count(),

            'active' => (clone $baseQuery)
                ->where('status', 'active')
                ->count(),

            'inactive' => (clone $baseQuery)
                ->where('status', 'inactive')
                ->count(),

            'new_this_month' => (clone $baseQuery)
                ->whereBetween('created_at', [
                    now('Asia/Manila')->startOfMonth(),
                    now('Asia/Manila')->endOfMonth(),
                ])
                ->count(),
        ];

        $query = clone $baseQuery;

        /*
         * Patient search.
         * LOWER + LIKE works on PostgreSQL and SQLite.
         */
        if (!empty($filters['search'])) {
            $search = '%' . strtolower(
                trim($filters['search'])
            ) . '%';

            $query->where(function ($q) use ($search) {
                $q->whereRaw(
                    "LOWER(patient_number) LIKE ?",
                    [$search]
                )->orWhereRaw(
                    "LOWER(first_name) LIKE ?",
                    [$search]
                )->orWhereRaw(
                    "LOWER(last_name) LIKE ?",
                    [$search]
                )->orWhereRaw(
                    "LOWER(COALESCE(middle_name, '')) LIKE ?",
                    [$search]
                )->orWhereRaw(
                    "LOWER(COALESCE(phone_number, '')) LIKE ?",
                    [$search]
                )->orWhereRaw(
                    "LOWER(COALESCE(email, '')) LIKE ?",
                    [$search]
                );
            });
        }

        /*
         * Filters.
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
            !empty($filters['sex']) &&
            $filters['sex'] !== 'all'
        ) {
            $query->whereRaw(
                'LOWER(sex) = ?',
                [strtolower($filters['sex'])]
            );
        }

        if (
            !empty($filters['age_group']) &&
            $filters['age_group'] !== 'all'
        ) {
            $now = now('Asia/Manila');

            if ($filters['age_group'] === 'child') {
                $query->whereDate(
                    'birth_date',
                    '>',
                    $now->copy()->subYears(18)->toDateString()
                );
            }

            if ($filters['age_group'] === 'adult') {
                $query
                    ->whereDate(
                        'birth_date',
                        '<=',
                        $now->copy()->subYears(18)->toDateString()
                    )
                    ->whereDate(
                        'birth_date',
                        '>',
                        $now->copy()->subYears(60)->toDateString()
                    );
            }

            if ($filters['age_group'] === 'senior') {
                $query->whereDate(
                    'birth_date',
                    '<=',
                    $now->copy()->subYears(60)->toDateString()
                );
            }
        }

        /*
         * Sorting.
         */
        switch ($filters['sort'] ?? 'name') {
            case 'newest':
                $query->orderByDesc('created_at');
                break;

            case 'oldest':
                $query->orderBy('created_at');
                break;

            default:
                $query
                    ->orderBy('last_name')
                    ->orderBy('first_name');
        }

        /*
         * Select only fields needed by the
         * patient listing and details interface.
         */
        $patients = $query
            ->select([
                'id',
                'patient_number',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'birth_date',
                'sex',
                'phone_number',
                'email',
                'blood_type',
                'street_address',
                'barangay',
                'city',
                'province',
                'status',
                'emergency_contact_name',
                'emergency_contact_relationship',
                'emergency_contact_phone',
                'created_at',
            ])
            ->paginate(20);

        return response()->json([
            'patients' => $patients->items(),

            'stats' => $stats,

            'pagination' => [
                'current_page' => $patients->currentPage(),
                'last_page' => $patients->lastPage(),
                'per_page' => $patients->perPage(),
                'total' => $patients->total(),
            ],
        ])->header('Cache-Control', 'private, no-store');
    }
}
