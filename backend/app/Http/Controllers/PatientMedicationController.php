<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use App\Services\PatientProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientMedicationController extends Controller
{
    public function index(
        Request $request,
        PatientProfileService $patientProfileService
    ): JsonResponse {
        $user = $request->user();

        // Only authenticated patients can use this endpoint.
        abort_unless(
            $user && $user->role === 'patient',
            403,
            'Patient access only.'
        );

        // Get the patient linked to the logged-in account.
        $patient = $patientProfileService->getProfile($user);

        abort_unless(
            $patient,
            404,
            'Patient profile not found.'
        );

        /*
        |--------------------------------------------------------------------------
        | Retrieve the Patient's Issued Prescriptions
        |--------------------------------------------------------------------------
        |
        | Only include:
        | - Prescriptions belonging to this patient
        | - Completed consultations
        | - Issued prescriptions
        |
        */

        $prescriptions = Prescription::query()
            ->where('status', 'issued')
            ->whereHas('consultation', function ($query) use ($patient) {
                $query
                    ->where('status', 'completed')
                    ->whereHas(
                        'queueEntry.appointment',
                        function ($appointmentQuery) use ($patient) {
                            $appointmentQuery->where(
                                'patient_id',
                                $patient->id
                            );
                        }
                    );
            })
            ->with('items')
            ->orderByDesc('issued_at')
            ->orderByDesc('id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Format Patient-Facing Medication Information
        |--------------------------------------------------------------------------
        */

        $medications = $prescriptions
            ->flatMap(function (Prescription $prescription) {
                return $prescription->items->map(
                    function ($item) use ($prescription) {
                        return [
                            'id' => $item->id,

                            'prescription_id' => $prescription->id,

                            'medicine' => $item->medicine,
                            'strength' => $item->strength,
                            'dosage' => $item->dosage,
                            'frequency' => $item->frequency,

                            'duration_days' => $item->duration_days,
                            'duration' => $item->duration,
                            'instructions' => $item->instructions,

                            // Doctor-defined schedule
                            'schedule_type' => $item->schedule_type,
                            'as_needed' => $item->as_needed,
                            'administration_times' =>
                                $item->administration_times,
                            'interval_hours' => $item->interval_hours,
                            'interval_scope' => $item->interval_scope,
                            'meal_relation' => $item->meal_relation,
                            'timing_instructions' =>
                                $item->timing_instructions,

                            'issued_at' => $prescription->issued_at
                                ?->toIso8601String(),
                        ];
                    }
                );
            })
            ->values()
            ->all();

        /*
        |--------------------------------------------------------------------------
        | Return Medication List
        |--------------------------------------------------------------------------
        */

        return response()->json([
            'medications' => $medications,
        ])->header(
            'Cache-Control',
            'private, no-store'
        );
    }
}
