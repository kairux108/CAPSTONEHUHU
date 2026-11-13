<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Consultation;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientMedicalHistoryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Doctor - View Patient Medical History
    |--------------------------------------------------------------------------
    |
    | Read-only endpoint.
    |
    | A doctor must have an active appointment assignment
    | with this patient today.
    |
    | Returns completed consultations and issued
    | prescriptions only.
    |
    */

    public function show(
        Request $request,
        Patient $patient
    ): JsonResponse {
        $doctor = $request->user();

        // Defense in depth: require an active doctor.
        abort_unless(
            $doctor &&
            $doctor->role === 'doctor' &&
            $doctor->status === 'active',
            403,
            'Doctor access only.'
        );

        $today = now('Asia/Manila')->toDateString();

        // Verify an active care assignment for today.
        $isAssigned = Appointment::query()
            ->where('patient_id', $patient->id)
            ->where('doctor_id', $doctor->id)
            ->whereDate('appointment_date', $today)
            ->whereIn('status', [
                'scheduled',
                'checked_in',
                'completed',
            ])
            ->exists();

        // Avoid exposing records to unrelated doctors.
        abort_unless(
            $isAssigned,
            404,
            'Patient medical history is not available.'
        );

        // Retrieve historical completed consultations.
        $history = Consultation::query()
            ->where('status', 'completed')
            ->whereHas(
                'queueEntry.appointment',
                fn ($query) =>
                    $query->where('patient_id', $patient->id)
            )
            ->with([
                'doctor:id,name',
                'diagnosis',
                'queueEntry.appointment',
                'prescription' => function ($query) {
                    $query
                        ->where('status', 'issued')
                        ->with([
                            'items',
                            'issuingDoctor:id,name',
                        ]);
                },
            ])
            ->orderByDesc('completed_at')
            ->orderByDesc('id')
            ->paginate(10);

        // Return only the information needed
        // for the medical history interface.
        $history->through(function ($consultation) {
            $appointment =
                $consultation->queueEntry?->appointment;

            $diagnosis = $consultation->diagnosis;
            $prescription = $consultation->prescription;

            return [
                'consultation_id' => $consultation->id,

                'completed_at' =>
                    $consultation->completed_at
                        ?->toIso8601String(),

                'doctor' => [
                    'id' => $consultation->doctor_id,
                    'name' =>
                        $consultation->doctor?->name,
                ],

                'appointment' => $appointment ? [
                    'id' => $appointment->id,
                    'date' =>
                        $appointment->appointment_date
                            ?->format('Y-m-d'),
                    'time' => $appointment->appointment_time,
                    'type' => $appointment->appointment_type,
                ] : null,

                'soap_notes' => [
                    'subjective' => $consultation->subjective,
                    'objective' => $consultation->objective,
                    'assessment' => $consultation->assessment,
                    'plan' => $consultation->plan,
                ],

                'care_plan' => [
                    'instructions' =>
                        $consultation->care_instructions,
                    'follow_up' =>
                        $consultation->follow_up_instructions,
                ],

                'diagnosis' => $diagnosis ? [
                    'name' => $diagnosis->name,
                    'notes' => $diagnosis->notes,
                    'reviewed' => (bool) $diagnosis->reviewed,
                ] : null,

                'prescription' => $prescription ? [
                    'id' => $prescription->id,
                    'status' => $prescription->status,
                    'issued_at' =>
                        $prescription->issued_at
                            ?->toIso8601String(),
                    'issued_by' =>
                        $prescription->issuingDoctor?->name,

                    'items' => $prescription->items
                        ->map(fn ($item) => [
                            'medicine' => $item->medicine,
                            'strength' => $item->strength,
                            'dosage' => $item->dosage,
                            'frequency' => $item->frequency,
                            'duration_days' => $item->duration_days,
                            'duration' => $item->duration,
                            'instructions' => $item->instructions,
                        ])
                        ->values()
                        ->all(),
                ] : null,
            ];
        });

        return response()->json([
            'patient' => [
                'id' => $patient->id,
                'patient_number' => $patient->patient_number,
                'name' => trim(implode(' ', array_filter([
                    $patient->first_name,
                    $patient->middle_name,
                    $patient->last_name,
                    $patient->suffix,
                ]))),
            ],

            'history' => $history,
        ])->header('Cache-Control', 'private, no-store');
    }
}
