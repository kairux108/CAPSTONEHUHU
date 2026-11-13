<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\Prescription;
use App\Models\QueueEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PrescriptionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Issue Final Digital Prescription
    |--------------------------------------------------------------------------
    |
    | Only the assigned doctor can issue a prescription.
    | The consultation must already be completed.
    | An issued prescription cannot be issued again.
    |
    */

    public function issue(
        Request $request,
        QueueEntry $queueEntry
    ): JsonResponse {

        // Doctor must explicitly confirm issuance.
        $request->validate([
            'confirm_issue' => [
                'required',
                'accepted',
            ],
        ]);

        // Verify queue is assigned to this doctor.
        abort_unless(
            (int) $queueEntry->doctor_id ===
            (int) $request->user()->id,
            403,
            'Only the assigned doctor can issue this prescription.'
        );

        $prescription = DB::transaction(function () use (
            $request,
            $queueEntry
        ) {

            // Lock and retrieve consultation.
            $consultation = Consultation::query()
                ->where('queue_entry_id', $queueEntry->id)
                ->lockForUpdate()
                ->first();

            abort_unless(
                $consultation,
                404,
                'Consultation not found.'
            );

            // Confirm consultation ownership.
            abort_unless(
                (int) $consultation->doctor_id ===
                (int) $request->user()->id,
                403,
                'You are not assigned to this consultation.'
            );

            // Require completed consultation.
            abort_unless(
                $consultation->status === 'completed',
                409,
                'Complete the consultation before issuing a prescription.'
            );

            // Retrieve existing prescription draft.
            $prescription = Prescription::query()
                ->where('consultation_id', $consultation->id)
                ->lockForUpdate()
                ->first();

            abort_unless(
                $prescription,
                422,
                'No prescription draft exists.'
            );

            // Prevent duplicate issuance.
            abort_unless(
                $prescription->status === 'draft',
                409,
                'This prescription has already been issued.'
            );

            // A prescription must contain medicine items.
            abort_unless(
                $prescription->items()->exists(),
                422,
                'Add at least one medicine before issuing.'
            );

            // Finalize the prescription.
            $prescription->status = 'issued';
            $prescription->issued_at = now();
            $prescription->issued_by = $request->user()->id;

            $prescription->save();

            return $prescription->load([
                'items',
                'issuingDoctor:id,name',
            ]);
        });

        return response()->json([
            'message' => 'Prescription issued successfully.',
            'prescription' => $prescription,
        ]);
    }
}
