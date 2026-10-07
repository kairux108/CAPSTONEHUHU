<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AppointmentController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | List Appointments
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
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

        if ($request->filled('search')) {
            $search = trim($request->search);

            $query->where(function ($q) use ($search) {
                $q->where('appointment_number', 'ilike', "%{$search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery
                            ->where('patient_number', 'ilike', "%{$search}%")
                            ->orWhere('first_name', 'ilike', "%{$search}%")
                            ->orWhere('middle_name', 'ilike', "%{$search}%")
                            ->orWhere('last_name', 'ilike', "%{$search}%")
                            ->orWhere('phone_number', 'ilike', "%{$search}%");
                    });
            });
        }

        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('appointment_type', $request->type);
        }

        if ($request->filled('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        if ($request->filled('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $query
            ->orderBy('appointment_date')
            ->orderBy('appointment_time');

        $appointments = $query->paginate(20);

        /*
        |--------------------------------------------------------------------------
        | Appointment Statistics
        |--------------------------------------------------------------------------
        */

        $today = now()->toDateString();

        return response()->json([
            'appointments' => $appointments->items(),

            'stats' => [
                'total_today' => Appointment::whereDate(
                    'appointment_date',
                    $today
                )->count(),

                'scheduled_today' => Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where('status', 'scheduled')
                    ->count(),

                'checked_in_today' => Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where('status', 'checked_in')
                    ->count(),

                'walk_in_today' => Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where('appointment_type', 'walk_in')
                    ->count(),

                'online_today' => Appointment::whereDate(
                    'appointment_date',
                    $today
                )
                    ->where('appointment_type', 'online')
                    ->count(),
            ],

            'pagination' => [
                'current_page' => $appointments->currentPage(),
                'last_page' => $appointments->lastPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Create Appointment
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => [
                'required',
                'exists:patients,id',
            ],

            'doctor_id' => [
                'nullable',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where('role', 'doctor')
                ),
            ],

            'appointment_date' => [
                'required',
                'date',
            ],

            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],

            'appointment_type' => [
                'required',
                Rule::in([
                    'online',
                    'walk_in',
                ]),
            ],

            'reason_for_visit' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $appointment = Appointment::create([
            'appointment_number' => $this->generateAppointmentNumber(),

            'patient_id' => $validated['patient_id'],

            'doctor_id' => $validated['doctor_id'] ?? null,

            'created_by' => $request->user()->id,

            'appointment_date' => $validated['appointment_date'],

            'appointment_time' => $validated['appointment_time'],

            'appointment_type' => $validated['appointment_type'],

            'reason_for_visit' => $validated['reason_for_visit'] ?? null,

            'status' => 'scheduled',
        ]);

        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return response()->json([
            'message' => 'Appointment created successfully.',
            'appointment' => $appointment,
        ], 201);
    }


    /*
    |--------------------------------------------------------------------------
    | Show Appointment
    |--------------------------------------------------------------------------
    */

    public function show(Appointment $appointment)
    {
        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return response()->json([
            'appointment' => $appointment,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Update Appointment
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'doctor_id' => [
                'nullable',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where('role', 'doctor')
                ),
            ],

            'appointment_date' => [
                'sometimes',
                'required',
                'date',
            ],

            'appointment_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'reason_for_visit' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    'scheduled',
                    'completed',
                    'cancelled',
                    'no_show',
                ]),
            ],
        ]);

        $appointment->update($validated);

        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Check In Patient
    |--------------------------------------------------------------------------
    */

    public function checkIn(Appointment $appointment)
    {
        if ($appointment->status !== 'scheduled') {
            return response()->json([
                'message' => 'Only scheduled appointments can be checked in.',
            ], 422);
        }

        $appointment->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return response()->json([
            'message' => 'Patient checked in successfully.',
            'appointment' => $appointment,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Doctor Options
    |--------------------------------------------------------------------------
    */

    public function doctors()
    {
        $doctors = User::query()
            ->where('role', 'doctor')
            ->where('status', 'active')
            ->orderBy('name')
            ->get([
                'id',
                'name',
            ]);

        return response()->json([
            'doctors' => $doctors,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Generate Appointment Number
    |--------------------------------------------------------------------------
    */

    private function generateAppointmentNumber(): string
    {
        do {
            $number = 'APT-' . Str::upper(
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