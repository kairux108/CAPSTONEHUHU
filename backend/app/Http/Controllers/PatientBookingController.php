<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use App\Services\AppointmentService;
use App\Services\BookingAvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PatientBookingController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | List Active Doctors
    |--------------------------------------------------------------------------
    */

    public function doctors(): JsonResponse
    {
        $doctors = User::query()
            ->where('role', 'doctor')
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json([
            'doctors' => $doctors,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Available Appointment Slots
    |--------------------------------------------------------------------------
    */

    public function availability(
        Request $request,
        BookingAvailabilityService $service
    ): JsonResponse {
        $validated = $request->validate([
            'doctor_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('role', 'doctor')
                    ->where('status', 'active'),
            ],
            'date' => [
                'required',
                'date_format:Y-m-d',
            ],
        ]);

        $slots = $service->getAvailableSlots(
            (int) $validated['doctor_id'],
            $validated['date']
        );

        return response()->json([
            'slots' => $slots,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Create Patient Appointment
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request,
        BookingAvailabilityService $availabilityService,
        AppointmentService $appointmentService
    ): JsonResponse {
        $user = $request->user();

        if ($user->role !== 'patient') {
            abort(403, 'Only patients can book appointments.');
        }

        $validated = $request->validate([
            'doctor_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('role', 'doctor')
                    ->where('status', 'active'),
            ],
            'appointment_date' => [
                'required',
                'date_format:Y-m-d',
            ],
            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],
            'reason_for_visit' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $patient = Patient::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->first();

        if (!$patient) {
            throw ValidationException::withMessages([
                'patient' =>
                    'Please complete your patient profile before booking.',
            ]);
        }

        $appointment = DB::transaction(function () use (
            $validated,
            $user,
            $patient,
            $availabilityService,
            $appointmentService
        ) {
            /*
             * Lock the doctor row so concurrent requests
             * through this booking flow are serialized.
             */
            $doctor = User::query()
                ->whereKey($validated['doctor_id'])
                ->where('role', 'doctor')
                ->where('status', 'active')
                ->lockForUpdate()
                ->first();

            if (!$doctor) {
                throw ValidationException::withMessages([
                    'doctor_id' =>
                        'The selected doctor is no longer available.',
                ]);
            }

            /*
             * Recalculate availability while holding
             * the doctor lock.
             */
            $slots = $availabilityService->getAvailableSlots(
                (int) $doctor->id,
                $validated['appointment_date']
            );

            $requestedTime = $validated['appointment_time'];

            $available = collect($slots)->contains(
                fn (array $slot) =>
                    $slot['time'] === $requestedTime
                    && $slot['available'] === true
            );

            if (!$available) {
                throw ValidationException::withMessages([
                    'appointment_time' =>
                        'This appointment slot is no longer available. Please select another time.',
                ]);
            }

            /*
             * Reuse the existing AppointmentService.
             * Patient ownership and appointment type
             * are determined on the server.
             */
            return $appointmentService->create(
                [
                    'patient_id' => $patient->id,
                    'doctor_id' => $doctor->id,
                    'appointment_date' =>
                        $validated['appointment_date'],
                    'appointment_time' => $requestedTime,
                    'appointment_type' => 'online',
                    'reason_for_visit' =>
                        $validated['reason_for_visit'] ?? null,
                ],
                $user
            );
        }, 3);

        return response()->json([
            'message' => 'Appointment booked successfully.',
            'appointment' => [
                'id' => $appointment->id,
                'appointment_number' =>
                    $appointment->appointment_number,
                'status' => $appointment->status,
            ],
        ], 201);
    }
}
