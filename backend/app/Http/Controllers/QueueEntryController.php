<?php

namespace App\Http\Controllers;

use App\Http\Requests\QueueIndexRequest;
use App\Http\Requests\StoreQueueEntryRequest;
use App\Http\Requests\UpdateQueueEntryRequest;
use App\Models\QueueEntry;
use App\Services\QueueQueryService;
use App\Services\QueueRecommendationService;
use App\Services\QueueService;

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
        $queueEntry =
            $queueService->update(
                $queueEntry,
                $request->validated()
            );

        return response()->json([
            'message' =>
                'Queue entry updated successfully.',

            'queue_entry' =>
                $queueEntry,
        ]);
    }
}