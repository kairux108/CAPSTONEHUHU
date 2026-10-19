<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePatientProfileRequest;
use App\Services\PatientProfileService;
use Illuminate\Http\Request;

class PatientProfileController extends Controller
{
    public function __construct(
        private PatientProfileService $patientProfileService
    ) {
    }

    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'patient') {
            return response()->json([
                'message' => 'Patient access only.',
            ], 403);
        }

        $patient = $this->patientProfileService
            ->getProfile($user);

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found.',
            ], 404);
        }

        return response()->json([
            'patient' => $this->formatPatient($patient),
        ]);
    }

    public function update(
        UpdatePatientProfileRequest $request
    ) {
        $patient = $this->patientProfileService
            ->updateProfile(
                $request->user(),
                $request->validated()
            );

        return response()->json([
            'message' => 'Profile updated successfully.',
            'patient' => $this->formatPatient($patient),
        ]);
    }

    private function formatPatient($patient): array
    {
        return [
            'id' => $patient->id,
            'patient_number' => $patient->patient_number,

            'first_name' => $patient->first_name,
            'middle_name' => $patient->middle_name,
            'last_name' => $patient->last_name,

            'birth_date' => $patient->birth_date,
            'sex' => $patient->sex,

            'phone_number' => $patient->phone_number,
            'email' => $patient->email,

            'address' => $patient->street_address,
            'city' => $patient->city,
            'province' => $patient->province,

            'blood_type' => $patient->blood_type,

            'emergency_contact_name' =>
                $patient->emergency_contact_name,

            'emergency_contact_number' =>
                $patient->emergency_contact_phone,

            'status' => $patient->status,
        ];
    }
}