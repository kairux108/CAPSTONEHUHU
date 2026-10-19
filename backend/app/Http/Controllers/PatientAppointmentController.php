<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Services\PatientAppointmentService;
use Illuminate\Http\Request;

class PatientAppointmentController extends Controller
{
    public function upcoming(
        Request $request,
        PatientAppointmentService $service
    ) {
        $user = $request->user();

        if ($user->role !== 'patient') {
            return response()->json([
                'message' => 'Patient access only.',
            ], 403);
        }

        $patient = Patient::where(
            'user_id',
            $user->id
        )->first();

        if (!$patient) {
            return response()->json([
                'message' =>
                    'Patient profile not found.',
            ], 404);
        }

        $appointment =
            $service->getUpcoming($patient);

        if (!$appointment) {
            return response()->json([
                'appointment' => null,
            ]);
        }

        return response()->json([
            'appointment' => [
                'id' =>
                    $appointment->id,

                'appointment_number' =>
                    $appointment->appointment_number,

                'doctor' =>
                    $appointment->doctor
                        ? [
                            'id' =>
                                $appointment->doctor->id,

                            'name' =>
                                $appointment->doctor->name,
                        ]
                        : null,

                'appointment_date' =>
                    $appointment
                        ->appointment_date
                        ->format('Y-m-d'),

                'appointment_time' =>
                    $appointment->appointment_time,

                'appointment_type' =>
                    $appointment->appointment_type,

                'reason_for_visit' =>
                    $appointment->reason_for_visit,

                'status' =>
                    $appointment->status,
            ],
        ]);
    }
}