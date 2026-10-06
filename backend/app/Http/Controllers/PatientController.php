<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET PATIENTS
    |--------------------------------------------------------------------------
    */

public function index(Request $request)
{
    $query = Patient::query();

    if ($request->filled('search')) {
        $search = trim($request->search);

        $query->where(function ($q) use ($search) {
            $q->where('patient_number', 'ilike', "%{$search}%")
                ->orWhere('first_name', 'ilike', "%{$search}%")
                ->orWhere('middle_name', 'ilike', "%{$search}%")
                ->orWhere('last_name', 'ilike', "%{$search}%")
                ->orWhere('email', 'ilike', "%{$search}%")
                ->orWhere('phone_number', 'ilike', "%{$search}%");
        });
    }

    if ($request->filled('status') && $request->status !== 'all') {
        $query->where('status', $request->status);
    }

    if ($request->filled('sex') && $request->sex !== 'all') {
        $query->whereRaw(
            'LOWER(sex) = ?',
            [strtolower($request->sex)]
        );
    }

    if ($request->filled('age_group') && $request->age_group !== 'all') {
        $ageGroup = $request->age_group;

        if ($ageGroup === 'child') {
            $query->whereDate(
                'birth_date',
                '>',
                now()->subYears(18)->toDateString()
            );
        }

        if ($ageGroup === 'adult') {
            $query
                ->whereDate(
                    'birth_date',
                    '<=',
                    now()->subYears(18)->toDateString()
                )
                ->whereDate(
                    'birth_date',
                    '>',
                    now()->subYears(60)->toDateString()
                );
        }

        if ($ageGroup === 'senior') {
            $query->whereDate(
                'birth_date',
                '<=',
                now()->subYears(60)->toDateString()
            );
        }
    }

    switch ($request->get('sort', 'name')) {
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

    $patients = $query->paginate(20);

    return response()->json([
        'patients' => $patients->items(),

        'stats' => [
            'total' => Patient::count(),

            'active' => Patient::where(
                'status',
                'active'
            )->count(),

            'inactive' => Patient::where(
                'status',
                'inactive'
            )->count(),

            'new_this_month' => Patient::whereBetween(
                'created_at',
                [
                    now()->startOfMonth(),
                    now()->endOfMonth(),
                ]
            )->count(),
        ],

        'pagination' => [
            'current_page' => $patients->currentPage(),
            'last_page' => $patients->lastPage(),
            'per_page' => $patients->perPage(),
            'total' => $patients->total(),
        ],
    ]);
}

    /*
    |--------------------------------------------------------------------------
    | CREATE PATIENT
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $this->validatePatient($request);

        $validated['patient_number'] = $this->generatePatientNumber();
        $validated['status'] = $validated['status'] ?? 'active';

        $patient = Patient::create($validated);

        return response()->json([
            'message' => 'Patient registered successfully.',
            'patient' => $patient,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | GET ONE PATIENT
    |--------------------------------------------------------------------------
    */

    public function show(Patient $patient)
    {
        return response()->json([
            'patient' => $patient,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE PATIENT
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, Patient $patient)
    {
        $validated = $this->validatePatient(
            $request,
            $patient
        );

        $patient->update($validated);

        return response()->json([
            'message' => 'Patient updated successfully.',
            'patient' => $patient->fresh(),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    private function validatePatient(
        Request $request,
        ?Patient $patient = null
    ): array {
        return $request->validate([
            'user_id' => [
                'nullable',
                'exists:users,id',
                Rule::unique('patients', 'user_id')
                    ->ignore($patient?->id),
            ],

            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'suffix' => [
                'nullable',
                'string',
                'max:50',
            ],

            'birth_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'sex' => [
                'required',
                'string',
                'max:20',
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'street_address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'barangay' => [
                'nullable',
                'string',
                'max:255',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'province' => [
                'nullable',
                'string',
                'max:255',
            ],

            'blood_type' => [
                'nullable',
                'string',
                'max:10',
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'emergency_contact_relationship' => [
                'nullable',
                'string',
                'max:255',
            ],

            'emergency_contact_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | GENERATE PATIENT NUMBER
    |--------------------------------------------------------------------------
    */

    private function generatePatientNumber(): string
    {
        do {
            $number = 'PT-' . Str::upper(
                Str::random(8)
            );
        } while (
            Patient::where(
                'patient_number',
                $number
            )->exists()
        );

        return $number;
    }
}