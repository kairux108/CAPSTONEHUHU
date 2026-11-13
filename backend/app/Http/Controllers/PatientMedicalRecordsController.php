<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Services\PatientProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientMedicalRecordsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | CURA - Patient Mobile Medical Records
    |--------------------------------------------------------------------------
    |
    | Read-only medical records for the logged-in patient.
    |
    | Security:
    | - Patient role required.
    | - Patient identity comes from the authenticated user.
    | - Only completed consultations.
    | - Only reviewed diagnoses.
    | - Only issued prescriptions.
    | - No internal SOAP notes.
    |
    */

    public function index(
        Request $request,
        PatientProfileService $patientProfileService
    ): JsonResponse {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'patient',
            403,
            'Patient access only.'
        );

        /*
        |--------------------------------------------------------------------------
        | Identify Logged-In Patient
        |--------------------------------------------------------------------------
        */

        $patient = $patientProfileService->getProfile($user);

        abort_unless(
            $patient,
            404,
            'Patient profile not found.'
        );

        /*
        |--------------------------------------------------------------------------
        | Retrieve Own Completed Consultations
        |--------------------------------------------------------------------------
        */

        $records = Consultation::query()
            ->where('status', 'completed')
            ->whereHas(
                'queueEntry.appointment',
                fn ($query) => $query->where(
                    'patient_id',
                    $patient->id
                )
            )
            ->with([
                'doctor:id,name',

                'diagnosis' => fn ($query) =>
                    $query->where('reviewed', true),

                'prescription' => fn ($query) =>
                    $query
                        ->where('status', 'issued')
                        ->with('items'),
            ])
            ->orderByDesc('completed_at')
            ->orderByDesc('id')
            ->paginate(10);

        /*
        |--------------------------------------------------------------------------
        | Format Patient-Facing Medical Records
        |--------------------------------------------------------------------------
        */

        $records->through(function ($consultation) {
            $prescription = $consultation->prescription;

            return [
                'consultation_id' => $consultation->id,

                'completed_at' =>
                    $consultation->completed_at
                        ?->toIso8601String(),

                'doctor_name' =>
                    $consultation->doctor?->name,

                'diagnosis' =>
                    $consultation->diagnosis
                        ? [
                            'name' =>
                                $consultation->diagnosis->name,
                        ]
                        : null,

                'care_instructions' =>
                    $consultation->care_instructions,

                'follow_up_instructions' =>
                    $consultation->follow_up_instructions,

                'prescription' => $prescription
                    ? [
                        'id' => $prescription->id,

                        'status' => $prescription->status,

                        'issued_at' =>
                            $prescription->issued_at
                                ?->toIso8601String(),

                        'medications' =>
                            $prescription->items
                                ->map(fn ($item) => [
                                    'medicine' => $item->medicine,
                                    'strength' => $item->strength,
                                    'dosage' => $item->dosage,
                                    'frequency' => $item->frequency,
                                    'duration_days' =>
                                        $item->duration_days,
                                    'duration' => $item->duration,
                                    'instructions' =>
                                        $item->instructions,
                                ])
                                ->values()
                                ->all(),
                    ]
                    : null,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Return Records with Pagination
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'patient' => [
                'id' => $patient->id,
                'patient_number' => $patient->patient_number,
            ],

            'records' => $records,
        ])->header(
            'Cache-Control',
            'private, no-store'
        );
    }
}
