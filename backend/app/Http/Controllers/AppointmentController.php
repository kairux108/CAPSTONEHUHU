<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentIndexRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Services\AppointmentQueryService;
use App\Services\AppointmentService;

class AppointmentController extends Controller
{
    public function index(
        AppointmentIndexRequest $request,
        AppointmentQueryService $appointmentQueryService
    ) {
        return response()->json(
            $appointmentQueryService
                ->getAppointments(
                    $request->validated()
                )
        );
    }

    public function store(
        StoreAppointmentRequest $request,
        AppointmentService $appointmentService
    ) {
        $appointment =
            $appointmentService->create(
                $request->validated(),
                $request->user()
            );

        return response()->json([
            'message' =>
                'Appointment created successfully.',

            'appointment' =>
                $appointment,
        ], 201);
    }

    public function show(
        Appointment $appointment
    ) {
        $appointment->load([
            'patient',
            'doctor:id,name,role',
            'creator:id,name,role',
        ]);

        return response()->json([
            'appointment' =>
                $appointment,
        ]);
    }

    public function update(
        UpdateAppointmentRequest $request,
        Appointment $appointment,
        AppointmentService $appointmentService
    ) {
        $appointment =
            $appointmentService->update(
                $appointment,
                $request->validated()
            );

        return response()->json([
            'message' =>
                'Appointment updated successfully.',

            'appointment' =>
                $appointment,
        ]);
    }

    public function checkIn(
        Appointment $appointment,
        AppointmentService $appointmentService
    ) {
        $appointment =
            $appointmentService->checkIn(
                $appointment
            );

        return response()->json([
            'message' =>
                'Patient checked in successfully.',

            'appointment' =>
                $appointment,
        ]);
    }

    public function doctors(
        AppointmentQueryService $appointmentQueryService
    ) {
        return response()->json([
            'doctors' =>
                $appointmentQueryService
                    ->getDoctors(),
        ]);
    }
}