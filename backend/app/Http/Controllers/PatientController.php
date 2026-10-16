<?php

namespace App\Http\Controllers;

use App\Http\Requests\PatientIndexRequest;
use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Services\PatientQueryService;
use App\Services\PatientService;

class PatientController extends Controller
{
    public function index(
        PatientIndexRequest $request,
        PatientQueryService $patientQueryService
    ) {
        return response()->json(
            $patientQueryService
                ->getPatients(
                    $request->validated()
                )
        );
    }

    public function store(
        StorePatientRequest $request,
        PatientService $patientService
    ) {
        $patient =
            $patientService->create(
                $request->validated()
            );

        return response()->json([
            'message' =>
                'Patient registered successfully.',

            'patient' =>
                $patient,
        ], 201);
    }

    public function show(
        Patient $patient
    ) {
        return response()->json([
            'patient' =>
                $patient,
        ]);
    }

    public function update(
        UpdatePatientRequest $request,
        Patient $patient,
        PatientService $patientService
    ) {
        $patient =
            $patientService->update(
                $patient,
                $request->validated()
            );

        return response()->json([
            'message' =>
                'Patient updated successfully.',

            'patient' =>
                $patient,
        ]);
    }
}