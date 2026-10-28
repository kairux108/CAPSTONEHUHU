<?php

namespace App\Services;

use App\Models\QueueEntry;
use Carbon\Carbon;

class QueueEtaService
{
    /*
    |--------------------------------------------------------------------------
    | ETA Configuration
    |--------------------------------------------------------------------------
    |
    | Use 20 minutes when no previous consultation
    | duration is available for the doctor.
    |
    */

    private const DEFAULT_DURATION_MINUTES = 20;

    private const MIN_DURATION_MINUTES = 5;

    private const MAX_DURATION_MINUTES = 60;

    private const HISTORY_LIMIT = 10;

    private const TIMEZONE = 'Asia/Manila';

    /*
    |--------------------------------------------------------------------------
    | Calculate Queue Waiting Times
    |--------------------------------------------------------------------------
    |
    | Returns:
    |
    | [
    |     queue_entry_id => estimated_wait_minutes,
    | ]
    |
    | This method does not modify the database.
    |
    */

    public function calculate(
        ?string $date = null
    ): array {
        $now = Carbon::now(self::TIMEZONE);

        $queueDate = $date ?? $now->toDateString();

        /*
         * Get active queue entries.
         */
        $entries = QueueEntry::query()
            ->with('appointment:id,doctor_id')
            ->whereDate('queue_date', $queueDate)
            ->whereIn('status', [
                'waiting',
                'called',
                'in_consultation',
            ])
            ->get();

        if ($entries->isEmpty()) {
            return [];
        }

        $results = [];

        /*
         * Each doctor has an independent queue.
         */
        $doctorQueues = $entries->groupBy(
            function (QueueEntry $entry) {
                return (string) (
                    $entry->doctor_id
                    ?? $entry->appointment?->doctor_id
                    ?? 'unassigned'
                );
            }
        );

        foreach ($doctorQueues as $doctorId => $queue) {
            /*
             * Estimate consultation duration using
             * the doctor's recent completed cases.
             */
            $duration = $this->getAverageDuration(
                is_numeric($doctorId)
                    ? (int) $doctorId
                    : null
            );

            $nextAvailableTime = $now->copy();

            /*
             * Patients currently in consultation
             * occupy the doctor's available time.
             */
            $consultingPatients = $queue
                ->where('status', 'in_consultation')
                ->sortBy('consultation_started_at');

            foreach ($consultingPatients as $entry) {
                $results[$entry->id] = 0;

                $elapsed = $entry->consultation_started_at
                    ? max(
                        0,
                        $entry->consultation_started_at
                            ->diffInMinutes($now)
                    )
                    : 0;

                /*
                 * Keep a small remaining estimate
                 * while consultation is still active.
                 */
                $remaining = max(
                    self::MIN_DURATION_MINUTES,
                    (int) ceil($duration - $elapsed)
                );

                $nextAvailableTime->addMinutes(
                    $remaining
                );
            }

            /*
             * Called patients go before waiting
             * patients in this initial ETA model.
             *
             * Within each status, use queue arrival
             * order until smart prioritization is
             * integrated.
             */
            $pendingPatients = $queue
                ->filter(
                    fn (QueueEntry $entry) =>
                        in_array(
                            $entry->status,
                            ['called', 'waiting'],
                            true
                        )
                )
                ->sort(
                    function (
                        QueueEntry $first,
                        QueueEntry $second
                    ) {
                        $firstRank =
                            $first->status === 'called'
                                ? 0
                                : 1;

                        $secondRank =
                            $second->status === 'called'
                                ? 0
                                : 1;

                        return
                            ($firstRank <=> $secondRank)
                            ?: (
                                ($first->queued_at?->timestamp ?? 0)
                                <=>
                                ($second->queued_at?->timestamp ?? 0)
                            )
                            ?: ($first->id <=> $second->id);
                    }
                );

            foreach ($pendingPatients as $entry) {
                /*
                 * Calculate minutes until this
                 * patient's estimated starting time.
                 */
                $secondsUntilStart =
                    $nextAvailableTime->timestamp
                    - $now->timestamp;

                $results[$entry->id] = max(
                    0,
                    (int) ceil(
                        $secondsUntilStart / 60
                    )
                );

                /*
                 * Reserve estimated consultation
                 * time for this patient.
                 */
                $nextAvailableTime->addMinutes(
                    $duration
                );
            }
        }

        return $results;
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Average Consultation Duration
    |--------------------------------------------------------------------------
    |
    | Uses up to 10 recent completed consultations
    | assigned to the same doctor.
    |
    */

    private function getAverageDuration(
        ?int $doctorId
    ): int {
        if (!$doctorId) {
            return self::DEFAULT_DURATION_MINUTES;
        }

        $history = QueueEntry::query()
            ->where('doctor_id', $doctorId)
            ->where('status', 'completed')
            ->whereNotNull('consultation_started_at')
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->limit(self::HISTORY_LIMIT)
            ->get();

        $durations = $history
            ->map(
                function (QueueEntry $entry) {
                    return $entry
                        ->consultation_started_at
                        ->diffInMinutes(
                            $entry->completed_at
                        );
                }
            )
            ->filter(
                fn ($minutes) =>
                    $minutes >= 1 &&
                    $minutes <= 240
            );

        if ($durations->isEmpty()) {
            return self::DEFAULT_DURATION_MINUTES;
        }

        $average = (int) round(
            $durations->avg()
        );

        return max(
            self::MIN_DURATION_MINUTES,
            min(
                self::MAX_DURATION_MINUTES,
                $average
            )
        );
    }
}
