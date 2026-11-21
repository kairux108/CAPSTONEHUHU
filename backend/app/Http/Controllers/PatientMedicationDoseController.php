<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreMedicationDoseRequest;
use App\Models\MedicationDoseLog;
use App\Models\PrescriptionItem;
use App\Services\PatientProfileService;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PatientMedicationDoseController extends Controller
{

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

    $patient = $patientProfileService->getProfile($user);

    abort_unless(
        $patient,
        404,
        'Patient profile not found.'
    );

    // Retrieve only this patient's recorded doses.
    // Also verify that each medication's consultation
    // belongs to the authenticated patient.
    $doseLogs = MedicationDoseLog::query()
        ->where('patient_id', $patient->id)
        ->whereHas(
            'prescriptionItem.prescription.consultation.queueEntry.appointment',
            fn (Builder $query) => $query->where(
                'patient_id',
                $patient->id
            )
        )
        ->with([
            'prescriptionItem:id,prescription_id,medicine,strength,dosage',
        ])
        ->orderByDesc('taken_at')
        ->orderByDesc('id')
        ->paginate(10);

    // Return only information appropriate for
    // the patient's medication history.
    $doseLogs->through(function (MedicationDoseLog $doseLog) {
        $item = $doseLog->prescriptionItem;

        return [
            'id' => $doseLog->id,
            'prescription_item_id' =>
                $doseLog->prescription_item_id,
            'medicine' => $item?->medicine,
            'strength' => $item?->strength,
            'dosage' => $item?->dosage,
            'taken_at' =>
                $doseLog->taken_at?->toIso8601String(),
            'scheduled_for' =>
                $doseLog->scheduled_for?->toIso8601String(),
            'recorded_at' =>
                $doseLog->created_at?->toIso8601String(),
        ];
    });

    return response()->json([
        'dose_logs' => $doseLogs,
    ])->header(
        'Cache-Control',
        'private, no-store'
    );
}

    public function store(
        StoreMedicationDoseRequest $request,
        PatientProfileService $patientProfileService
    ): JsonResponse {
        $user = $request->user();

        abort_unless(
            $user && $user->role === 'patient',
            403,
            'Patient access only.'
        );

        $patient = $patientProfileService->getProfile($user);

        abort_unless(
            $patient,
            404,
            'Patient profile not found.'
        );

        $data = $request->validated();

        // The prescription item must belong to this patient,
        // be issued, and follow a completed consultation.
        $item = PrescriptionItem::query()
            ->whereKey($data['prescription_item_id'])
            ->whereHas(
                'prescription',
                function (Builder $query) use ($patient) {
                    $query
                        ->where('status', 'issued')
                        ->whereNotNull('issued_at')
                        ->whereHas(
                            'consultation',
                            function (Builder $consultationQuery) use ($patient) {
                                $consultationQuery
                                    ->where('status', 'completed')
                                    ->whereHas(
                                        'queueEntry.appointment',
                                        fn (Builder $appointmentQuery) =>
                                            $appointmentQuery->where(
                                                'patient_id',
                                                $patient->id
                                            )
                                    );
                            }
                        );
                }
            )
            ->with('prescription')
            ->firstOrFail();

        // This time is reported by the patient, not verified
        // by CURA as an observed medication administration.

        $takenAt = CarbonImmutable::parse(
            $data['taken_at']
        )
            ->utc()
            ->startOfSecond();


        $issuedAt = CarbonImmutable::parse(
            $item->prescription->issued_at
        );

        // Allow five minutes for device clock differences.
        // Do not accept doses before prescription issuance.
        if (
            $takenAt->greaterThan(now()->addMinutes(5)) ||
            $takenAt->lessThan($issuedAt)
        ) {
            throw ValidationException::withMessages([
                'taken_at' =>
                    'The reported time must be after prescription issuance and cannot be in the future.',
            ]);
        }

        // Recognize retries using the same request identifier.
        $existing = MedicationDoseLog::query()
            ->where('request_id', $data['request_id'])
            ->first();

        if ($existing) {
            return $this->handleExisting(
                $existing,
                $patient->id,
                $item->id,
                $takenAt
            );
        }

        try {
            // Ownership and recording account are assigned
            // by the server, never by the mobile client.
            $doseLog = MedicationDoseLog::create([
                'patient_id' => $patient->id,
                'prescription_item_id' => $item->id,
                'recorded_by_user_id' => $user->id,
                'taken_at' => $takenAt,
                'scheduled_for' => null,
                'request_id' => $data['request_id'],
            ]);
        } catch (UniqueConstraintViolationException $exception) {
            // A concurrent retry may have inserted the same UUID.
            $existing = MedicationDoseLog::query()
                ->where('request_id', $data['request_id'])
                ->first();

            if (!$existing) {
                throw $exception;
            }

            return $this->handleExisting(
                $existing,
                $patient->id,
                $item->id,
                $takenAt
            );
        }

        return $this->doseResponse($doseLog, 201);
    }

    private function handleExisting(
        MedicationDoseLog $existing,
        int $patientId,
        int $prescriptionItemId,
        CarbonImmutable $takenAt
    ): JsonResponse {

        // Read the database timestamp before Laravel's
        // application-timezone date casting.
        //
        // CURA stores the reported timestamp in UTC.
        // SQLite returns it without a timezone, while
        // PostgreSQL may return an explicit offset.
        $storedTakenAt = $existing->getRawOriginal('taken_at');

        $sameTime = $storedTakenAt !== null &&
            CarbonImmutable::parse(
                (string) $storedTakenAt,
                'UTC'
            )->utc()->equalTo($takenAt);

        $sameConfirmation =
            (int) $existing->patient_id === $patientId &&
            (int) $existing->prescription_item_id === $prescriptionItemId &&
            $sameTime;

        if (!$sameConfirmation) {
            return response()->json([
                'message' =>
                    'This confirmation identifier has already been used.',
            ], 409)->header(
                'Cache-Control',
                'private, no-store'
            );
        }

        // Safe retry: return the existing record.
        return $this->doseResponse($existing, 200);
    }

    private function doseResponse(
        MedicationDoseLog $doseLog,
        int $status
    ): JsonResponse {
        return response()->json([
            'message' => 'Patient-reported dose recorded.',
            'dose_log' => [
                'id' => $doseLog->id,
                'prescription_item_id' =>
                    $doseLog->prescription_item_id,
                'taken_at' =>
                    $doseLog->taken_at?->toIso8601String(),
                'scheduled_for' =>
                    $doseLog->scheduled_for?->toIso8601String(),
                'recorded_at' =>
                    $doseLog->created_at?->toIso8601String(),
            ],
        ], $status)->header(
            'Cache-Control',
            'private, no-store'
        );
    }
}
