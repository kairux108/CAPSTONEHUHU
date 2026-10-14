<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\VitalSign;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VitalSignController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => ['nullable', 'integer', 'exists:patients,id'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = VitalSign::query()
            ->with([
                'patient:id,first_name,middle_name,last_name,suffix',
                'appointment:id,appointment_number,appointment_date,appointment_time,status',
                'recorder:id,name',
            ])
            ->latest();

        if (!empty($validated['patient_id'])) {
            $query->where('patient_id', $validated['patient_id']);
        }

        if (!empty($validated['appointment_id'])) {
            $query->where('appointment_id', $validated['appointment_id']);
        }

        $vitalSigns = $query->paginate($validated['per_page'] ?? 20);

        return response()->json([
            'vital_signs' => $vitalSigns->items(),

            'pagination' => [
                'current_page' => $vitalSigns->currentPage(),
                'last_page' => $vitalSigns->lastPage(),
                'per_page' => $vitalSigns->perPage(),
                'total' => $vitalSigns->total(),
            ],
        ]);
    }

    public function show(VitalSign $vitalSign)
    {
        $vitalSign->load([
            'patient:id,first_name,middle_name,last_name,suffix',
            'appointment:id,appointment_number,appointment_date,appointment_time,status',
            'recorder:id,name',
        ]);

        return response()->json([
            'vital_sign' => $vitalSign,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' => [
                'required',
                'integer',
                'exists:appointments,id',
            ],

            'blood_pressure_systolic' => [
                'nullable',
                'required_with:blood_pressure_diastolic',
                'integer',
                'min:1',
                'max:400',
            ],

            'blood_pressure_diastolic' => [
                'nullable',
                'required_with:blood_pressure_systolic',
                'integer',
                'min:1',
                'max:300',
            ],

            'oxygen_saturation' => [
                'nullable',
                'integer',
                'min:0',
                'max:100',
            ],

            'temperature' => [
                'nullable',
                'numeric',
                'min:20',
                'max:50',
            ],

            'heart_rate' => [
                'nullable',
                'integer',
                'min:1',
                'max:300',
            ],

            'respiratory_rate' => [
                'nullable',
                'integer',
                'min:1',
                'max:150',
            ],

            'weight' => [
                'nullable',
                'numeric',
                'min:0.1',
                'max:1000',
            ],

            'height' => [
                'nullable',
                'numeric',
                'min:10',
                'max:300',
            ],
        ]);

        $this->ensureMeasurementExists($validated);

        $appointment = Appointment::findOrFail(
            $validated['appointment_id']
        );

        if ($appointment->status !== 'checked_in') {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'The patient must be checked in before recording vital signs.',
            ]);
        }

        $existingVitalSign = VitalSign::where(
            'appointment_id',
            $appointment->id
        )->first();

        if ($existingVitalSign) {
            throw ValidationException::withMessages([
                'appointment_id' =>
                    'Vital signs have already been recorded for this appointment.',
            ]);
        }

        $vitalSign = VitalSign::create([
            'patient_id' => $appointment->patient_id,
            'appointment_id' => $appointment->id,
            'recorded_by' => $request->user()->id,

            'blood_pressure_systolic' =>
                $validated['blood_pressure_systolic'] ?? null,

            'blood_pressure_diastolic' =>
                $validated['blood_pressure_diastolic'] ?? null,

            'oxygen_saturation' =>
                $validated['oxygen_saturation'] ?? null,

            'temperature' =>
                $validated['temperature'] ?? null,

            'heart_rate' =>
                $validated['heart_rate'] ?? null,

            'respiratory_rate' =>
                $validated['respiratory_rate'] ?? null,

            'weight' =>
                $validated['weight'] ?? null,

            'height' =>
                $validated['height'] ?? null,
        ]);

        $vitalSign->load([
            'patient:id,first_name,middle_name,last_name,suffix',
            'appointment:id,appointment_number,appointment_date,appointment_time,status',
            'recorder:id,name',
        ]);

        return response()->json([
            'message' => 'Vital signs recorded successfully.',
            'vital_sign' => $vitalSign,
        ], 201);
    }

    public function update(
        Request $request,
        VitalSign $vitalSign
    ) {
        $validated = $request->validate([
            'blood_pressure_systolic' => [
                'nullable',
                'required_with:blood_pressure_diastolic',
                'integer',
                'min:1',
                'max:400',
            ],

            'blood_pressure_diastolic' => [
                'nullable',
                'required_with:blood_pressure_systolic',
                'integer',
                'min:1',
                'max:300',
            ],

            'oxygen_saturation' => [
                'nullable',
                'integer',
                'min:0',
                'max:100',
            ],

            'temperature' => [
                'nullable',
                'numeric',
                'min:20',
                'max:50',
            ],

            'heart_rate' => [
                'nullable',
                'integer',
                'min:1',
                'max:300',
            ],

            'respiratory_rate' => [
                'nullable',
                'integer',
                'min:1',
                'max:150',
            ],

            'weight' => [
                'nullable',
                'numeric',
                'min:0.1',
                'max:1000',
            ],

            'height' => [
                'nullable',
                'numeric',
                'min:10',
                'max:300',
            ],
        ]);

        $this->ensureMeasurementExists($validated);

        $appointment = $vitalSign->appointment;

        if (
            $appointment &&
            $appointment->status !== 'checked_in'
        ) {
            throw ValidationException::withMessages([
                'appointment' =>
                    'Vital signs can only be edited while the patient is checked in.',
            ]);
        }

        $vitalSign->update($validated);

        $vitalSign->load([
            'patient:id,first_name,middle_name,last_name,suffix',
            'appointment:id,appointment_number,appointment_date,appointment_time,status',
            'recorder:id,name',
        ]);

        return response()->json([
            'message' => 'Vital signs updated successfully.',
            'vital_sign' => $vitalSign,
        ]);
    }

    private function ensureMeasurementExists(array $data): void
    {
        $fields = [
            'blood_pressure_systolic',
            'blood_pressure_diastolic',
            'oxygen_saturation',
            'temperature',
            'heart_rate',
            'respiratory_rate',
            'weight',
            'height',
        ];

        foreach ($fields as $field) {
            if (
                array_key_exists($field, $data) &&
                $data[$field] !== null &&
                $data[$field] !== ''
            ) {
                return;
            }
        }

        throw ValidationException::withMessages([
            'vital_signs' =>
                'Please enter at least one vital sign measurement.',
        ]);
    }
}