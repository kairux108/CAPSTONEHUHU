<?php

namespace App\Http\Controllers;

use App\Http\Requests\QueueIndexRequest;
use App\Http\Requests\StoreQueueEntryRequest;
use App\Http\Requests\UpdateQueueEntryRequest;
use App\Models\QueueEntry;
use App\Services\QueueQueryService;
use App\Services\QueueRecommendationService;
use App\Services\QueueService;
use Illuminate\Validation\ValidationException;
class QueueEntryController extends Controller
{
    public function index(
        QueueIndexRequest $request,
        QueueQueryService $queueQueryService,
        QueueRecommendationService $queueRecommendationService
    ) {
        $result =
            $queueQueryService->getQueue(
                $request->validated()
            );

        return response()->json([
            'queue_entries' =>
                $result['queue_entries'],

            'next_recommended' =>
                $queueRecommendationService
                    ->getNextRecommended(
                        $result['date']
                    ),

            'stats' =>
                $result['stats'],

            'pagination' =>
                $result['pagination'],
        ]);
    }

    public function show(
        QueueEntry $queueEntry
    ) {
        $queueEntry->load([
            'appointment.patient',
            'appointment.doctor:id,name',
            'doctor:id,name',
            'creator:id,name',
        ]);

        return response()->json([
            'queue_entry' =>
                $queueEntry,
        ]);
    }

    public function store(
        StoreQueueEntryRequest $request,
        QueueService $queueService
    ) {
        $queueEntry =
            $queueService->create(
                $request->validated(),
                $request->user()
            );

        return response()->json([
            'message' =>
                'Patient added to queue successfully.',

            'queue_entry' =>
                $queueEntry,
        ], 201);
    }



public function update(
    UpdateQueueEntryRequest $request,
    QueueEntry $queueEntry,
    QueueService $queueService
) {
    $data = $request->validated();

    /*
    |--------------------------------------------------------------------------
    | Prevent Staff From Bypassing Doctor Consultation
    |--------------------------------------------------------------------------
    |
    | Only the assigned doctor can start or complete
    | consultations through the doctor consultation API.
    |
    */

    if (in_array(
        $data['status'] ?? null,
        ['in_consultation', 'completed'],
        true
    )) {
        throw ValidationException::withMessages([
            'status' =>
                'Only the assigned doctor can start or complete a consultation.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Queue Entry
    |--------------------------------------------------------------------------
    */

    $queueEntry = $queueService->update(
        $queueEntry,
        $data
    );

    /*
    |--------------------------------------------------------------------------
    | Return Updated Queue
    |--------------------------------------------------------------------------
    */

    return response()->json([
        'message' => 'Queue entry updated successfully.',
        'queue_entry' => $queueEntry,
    ]);
}


}