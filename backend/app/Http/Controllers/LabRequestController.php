<?php

namespace App\Http\Controllers;

use App\Models\Consultation;
use App\Models\LabTestCatalog;
use App\Models\LabRequest;
use App\Models\QueueEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LabRequestController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Create Laboratory Request Draft
    |--------------------------------------------------------------------------
    |
    | Only the assigned doctor can create a laboratory request.
    | A consultation can have multiple laboratory requests.
    | Catalog and custom examinations can be combined.
    | The request remains a draft until explicitly issued.
    |
    */

    public function storeDraft(
        Request $request,
        QueueEntry $queueEntry
    ): JsonResponse {

        $doctorId = (int) $request->user()->id;

        // Verify doctor assignment.
        abort_unless(
            (int) $queueEntry->doctor_id === $doctorId,
            403,
            'You are not assigned to this queue entry.'
        );

        // Validate laboratory request input.
        $validated = $request->validate([
            'clinical_indication' => [
                'nullable', 'string', 'max:2000',
            ],
            'instructions' => [
                'nullable', 'string', 'max:2000',
            ],
            'catalog_test_ids' => [
                'sometimes', 'array', 'max:67',
            ],
            'catalog_test_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('lab_test_catalog', 'id')
                    ->where('is_active', true),
            ],
            'custom_tests' => [
                'sometimes', 'array', 'max:20',
            ],
            'custom_tests.*' => [
                'required',
                'string',
                'max:255',
                'distinct:ignore_case',
            ],
        ]);

        $catalogIds = $validated['catalog_test_ids'] ?? [];
        $customTests = $validated['custom_tests'] ?? [];

        // At least one examination must be selected.
        if (count($catalogIds) + count($customTests) === 0) {
            throw ValidationException::withMessages([
                'tests' => 'Select or specify at least one examination.',
            ]);
        }

        $labRequest = DB::transaction(function () use (
            $queueEntry,
            $doctorId,
            $validated,
            $catalogIds,
            $customTests
        ) {

            // Lock consultation and confirm ownership.
            $consultation = Consultation::query()
                ->where('queue_entry_id', $queueEntry->id)
                ->lockForUpdate()
                ->first();

            abort_unless(
                $consultation,
                404,
                'Consultation not found.'
            );

            abort_unless(
                (int) $consultation->doctor_id === $doctorId,
                403,
                'You are not assigned to this consultation.'
            );

            // Retrieve active catalog examinations.
            $catalogTests = LabTestCatalog::query()
                ->where('is_active', true)
                ->whereIn('id', $catalogIds)
                ->get()
                ->keyBy('id');

            // Reject examinations that are no longer available.
            if ($catalogTests->count() !== count($catalogIds)) {
                throw ValidationException::withMessages([
                    'catalog_test_ids' =>
                        'One or more selected examinations are unavailable.',
                ]);
            }

            // Create a new draft for this consultation.
            $labRequest = $consultation->labRequests()->create([
                'requested_by' => $doctorId,
                'clinical_indication' =>
                    $validated['clinical_indication'] ?? null,
                'instructions' =>
                    $validated['instructions'] ?? null,
            ]);

            // Save selected catalog examinations.
            foreach ($catalogIds as $testId) {
                $test = $catalogTests->get($testId);

                $labRequest->items()->create([
                    'lab_test_catalog_id' => $test->id,
                    'test_name' => $test->name,
                    'category' => $test->category,
                    'is_custom' => false,
                ]);
            }

            // Save examinations entered through Other (Specify).
            foreach ($customTests as $testName) {
                $labRequest->items()->create([
                    'lab_test_catalog_id' => null,
                    'test_name' => trim($testName),
                    'category' => 'Other',
                    'is_custom' => true,
                ]);
            }


            return $labRequest->refresh()->load('items');

        });

        return response()->json([
            'message' => 'Laboratory request draft saved successfully.',
            'lab_request' => $labRequest,
        ], 201);


    }

/*
|--------------------------------------------------------------------------
| Update Existing Laboratory Request Draft
|--------------------------------------------------------------------------
|
| Only the assigned doctor may update an existing draft.
| Issued laboratory requests cannot be modified.
| Selected examinations are replaced atomically.
|
*/

public function updateDraft(
    Request $request,
    QueueEntry $queueEntry,
    LabRequest $labRequest
): JsonResponse {

    $doctorId = (int) $request->user()->id;

    abort_unless(
        (int) $queueEntry->doctor_id === $doctorId,
        403,
        'You are not assigned to this queue entry.'
    );

    $validated = $request->validate([
        'clinical_indication' => [
            'nullable', 'string', 'max:2000',
        ],
        'instructions' => [
            'nullable', 'string', 'max:2000',
        ],
        'catalog_test_ids' => [
            'sometimes', 'array', 'max:67',
        ],
        'catalog_test_ids.*' => [
            'required',
            'integer',
            'distinct',
            Rule::exists('lab_test_catalog', 'id')
                ->where('is_active', true),
        ],
        'custom_tests' => [
            'sometimes', 'array', 'max:20',
        ],
        'custom_tests.*' => [
            'required',
            'string',
            'max:255',
            'distinct:ignore_case',
        ],
    ]);

    $catalogIds = $validated['catalog_test_ids'] ?? [];
    $customTests = $validated['custom_tests'] ?? [];

    if (count($catalogIds) + count($customTests) === 0) {
        throw ValidationException::withMessages([
            'tests' => 'Select or specify at least one examination.',
        ]);
    }

    $updatedRequest = DB::transaction(function () use (
        $queueEntry,
        $labRequest,
        $doctorId,
        $validated,
        $catalogIds,
        $customTests
    ) {

        // Confirm consultation ownership.
        $consultation = Consultation::query()
            ->where('queue_entry_id', $queueEntry->id)
            ->lockForUpdate()
            ->first();

        abort_unless(
            $consultation,
            404,
            'Consultation not found.'
        );

        abort_unless(
            (int) $consultation->doctor_id === $doctorId,
            403,
            'You are not assigned to this consultation.'
        );

        // Lock the requested draft, scoped to this consultation.
        $draft = LabRequest::query()
            ->whereKey($labRequest->id)
            ->where('consultation_id', $consultation->id)
            ->lockForUpdate()
            ->first();

        abort_unless(
            $draft,
            404,
            'Laboratory request not found for this consultation.'
        );

        abort_unless(
            (int) $draft->requested_by === $doctorId,
            403,
            'You cannot edit another doctor’s laboratory request.'
        );

        abort_unless(
            $draft->status === 'draft',
            409,
            'An issued laboratory request cannot be edited.'
        );

        // Reload selected catalog examinations.
        $catalogTests = LabTestCatalog::query()
            ->where('is_active', true)
            ->whereIn('id', $catalogIds)
            ->get()
            ->keyBy('id');

        if ($catalogTests->count() !== count($catalogIds)) {
            throw ValidationException::withMessages([
                'catalog_test_ids' =>
                    'One or more selected examinations are unavailable.',
            ]);
        }

        // Update draft details.
        $draft->update([
            'clinical_indication' =>
                $validated['clinical_indication'] ?? null,
            'instructions' =>
                $validated['instructions'] ?? null,
        ]);

        // Replace examination items within the same transaction.
        $draft->items()->delete();

        foreach ($catalogIds as $testId) {
            $test = $catalogTests->get($testId);

            $draft->items()->create([
                'lab_test_catalog_id' => $test->id,
                'test_name' => $test->name,
                'category' => $test->category,
                'is_custom' => false,
            ]);
        }

        foreach ($customTests as $testName) {
            $draft->items()->create([
                'lab_test_catalog_id' => null,
                'test_name' => trim($testName),
                'category' => 'Other',
                'is_custom' => true,
            ]);
        }

        return $draft->refresh()->load('items');
    });

    return response()->json([
        'message' => 'Laboratory request draft updated successfully.',
        'lab_request' => $updatedRequest,
    ]);
}

/*
|--------------------------------------------------------------------------
| Issue Laboratory Request
|--------------------------------------------------------------------------
|
| Only the assigned doctor can issue a request.
| The consultation must be completed.
| A draft must contain at least one examination.
| An issued request cannot be issued again.
|
*/

public function issue(
    Request $request,
    QueueEntry $queueEntry,
    LabRequest $labRequest
): JsonResponse {

    // Require explicit doctor confirmation.
    $request->validate([
        'confirm_issue' => [
            'required',
            'accepted',
        ],
    ]);

    $doctorId = (int) $request->user()->id;

    // Verify doctor assignment.
    abort_unless(
        (int) $queueEntry->doctor_id === $doctorId,
        403,
        'Only the assigned doctor can issue this laboratory request.'
    );

    $issuedRequest = DB::transaction(function () use (
        $queueEntry,
        $labRequest,
        $doctorId
    ) {

        // Lock the associated consultation.
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
            (int) $consultation->doctor_id === $doctorId,
            403,
            'You are not assigned to this consultation.'
        );

        // Consultation must be completed before issuance.
        abort_unless(
            $consultation->status === 'completed',
            409,
            'Complete the consultation before issuing a laboratory request.'
        );

        // Lock the request and verify it belongs to the consultation.
        $draft = LabRequest::query()
            ->whereKey($labRequest->id)
            ->where('consultation_id', $consultation->id)
            ->lockForUpdate()
            ->first();

        abort_unless(
            $draft,
            404,
            'Laboratory request not found for this consultation.'
        );

        // Verify the requesting doctor.
        abort_unless(
            (int) $draft->requested_by === $doctorId,
            403,
            'You cannot issue another doctor’s laboratory request.'
        );

        // Prevent issuing the same request twice.
        abort_unless(
            $draft->status === 'draft',
            409,
            'This laboratory request has already been issued.'
        );

        // Reject empty laboratory requests.
        abort_unless(
            $draft->items()->exists(),
            422,
            'Add at least one examination before issuing.'
        );

        // Finalize the laboratory request.
        $draft->status = 'issued';
        $draft->issued_by = $doctorId;
        $draft->issued_at = now();

        $draft->save();

        return $draft->refresh()->load([
            'items',
            'issuingDoctor:id,name',
        ]);
    });

    return response()->json([
        'message' => 'Laboratory request issued successfully.',
        'lab_request' => $issuedRequest,
    ]);
}

/*
|--------------------------------------------------------------------------
| Retrieve Laboratory Requests
|--------------------------------------------------------------------------
|
| Only the assigned doctor can view laboratory
| requests linked to their consultation.
|
| Returns both draft and issued requests,
| including their examination items.
|
*/

public function index(
    Request $request,
    QueueEntry $queueEntry
): JsonResponse {

    $doctorId = (int) $request->user()->id;

    // Verify the doctor is assigned to the queue.
    abort_unless(
        (int) $queueEntry->doctor_id === $doctorId,
        403,
        'You are not assigned to this queue entry.'
    );

    // Retrieve the corresponding consultation.
    $consultation = Consultation::query()
        ->where('queue_entry_id', $queueEntry->id)
        ->first();

    abort_unless(
        $consultation,
        404,
        'Consultation not found.'
    );

    // Confirm consultation ownership.
    abort_unless(
        (int) $consultation->doctor_id === $doctorId,
        403,
        'You are not assigned to this consultation.'
    );

    // Retrieve saved laboratory requests.
    $labRequests = $consultation->labRequests()
        ->with([
            'items' => fn ($query) => $query->orderBy('id'),
            'requestingDoctor:id,name',
            'issuingDoctor:id,name',
        ])
        ->orderByDesc('id')
        ->get();

    return response()->json([
        'lab_requests' => $labRequests,
    ]);
}

}
