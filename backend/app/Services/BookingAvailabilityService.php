<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\DoctorAvailability;
use App\Models\DoctorUnavailability;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class BookingAvailabilityService
{
    private const TIMEZONE = 'Asia/Manila';

    public function getAvailableSlots(
        int $doctorId,
        string $date
    ): array {
        try {
            $selectedDate = Carbon::createFromFormat(
                '!Y-m-d',
                $date,
                self::TIMEZONE
            );
        } catch (\Throwable $exception) {
            throw ValidationException::withMessages([
                'date' => 'Invalid appointment date.',
            ]);
        }

        if ($selectedDate->format('Y-m-d') !== $date) {
            throw ValidationException::withMessages([
                'date' => 'Invalid appointment date.',
            ]);
        }

        if ($selectedDate->lt(
            Carbon::today(self::TIMEZONE)
        )) {
            return [];
        }

        $schedules = DoctorAvailability::query()
            ->where('doctor_id', $doctorId)
            ->where('day_of_week', $selectedDate->dayOfWeek)
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        if ($schedules->isEmpty()) {
            return [];
        }

        $dayStart = $selectedDate->copy()->startOfDay();
        $dayEnd = $dayStart->copy()->addDay();

        $unavailablePeriods = DoctorUnavailability::query()
            ->where('doctor_id', $doctorId)
            ->where('start_at', '<', $dayEnd)
            ->where('end_at', '>', $dayStart)
            ->get();

        $appointments = Appointment::query()
            ->where('doctor_id', $doctorId)
            ->whereDate('appointment_date', $date)
            ->whereNotIn('status', [
                'cancelled',
                'no_show',
            ])
            ->get();

        $slots = [];

        foreach ($schedules as $schedule) {
            $duration = (int) $schedule->slot_duration_minutes;

            if ($duration <= 0) {
                continue;
            }

            $start = Carbon::parse(
                $date . ' ' . $schedule->start_time,
                self::TIMEZONE
            );

            $end = Carbon::parse(
                $date . ' ' . $schedule->end_time,
                self::TIMEZONE
            );

            if ($end->lte($start)) {
                continue;
            }

            while ($start->copy()->addMinutes($duration)->lte($end)) {
                $slotStart = $start->copy();

                $slotEnd = $slotStart->copy()
                    ->addMinutes($duration);

                $time = $slotStart->format('H:i');

                $isPast = $slotStart->lte(
                    Carbon::now(self::TIMEZONE)
                );

                $isOnLeave = $this->overlapsLeave(
                    $slotStart,
                    $slotEnd,
                    $unavailablePeriods
                );

                $isBooked = $this->overlapsAppointment(
                    $slotStart,
                    $slotEnd,
                    $appointments,
                    $date,
                    $duration
                );

                $slots[$time] = [
                    'time' => $time,
                    'available' => !(
                        $isPast ||
                        $isOnLeave ||
                        $isBooked ||
                        (isset($slots[$time]) &&
                            !$slots[$time]['available'])
                    ),
                ];

                $start->addMinutes($duration);
            }
        }

        ksort($slots);

        return array_values($slots);
    }

    private function overlapsLeave(
        Carbon $slotStart,
        Carbon $slotEnd,
        Collection $periods
    ): bool {
        foreach ($periods as $period) {
            $leaveStart = Carbon::parse(
                $period->start_at,
                self::TIMEZONE
            );

            $leaveEnd = Carbon::parse(
                $period->end_at,
                self::TIMEZONE
            );

            if (
                $slotStart->lt($leaveEnd) &&
                $slotEnd->gt($leaveStart)
            ) {
                return true;
            }
        }

        return false;
    }

    private function overlapsAppointment(
        Carbon $slotStart,
        Carbon $slotEnd,
        Collection $appointments,
        string $date,
        int $duration
    ): bool {
        foreach ($appointments as $appointment) {
            $bookingStart = Carbon::parse(
                $date . ' ' . $appointment->appointment_time,
                self::TIMEZONE
            );

            // Temporary assumption:
            // existing appointments use the schedule slot duration.
            $bookingEnd = $bookingStart->copy()
                ->addMinutes($duration);

            if (
                $slotStart->lt($bookingEnd) &&
                $slotEnd->gt($bookingStart)
            ) {
                return true;
            }
        }

        return false;
    }
}
