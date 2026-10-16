<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Support\Str;

class PatientService
{
    public function create(
        array $data
    ): Patient {
        $data['patient_number'] =
            $this->generatePatientNumber();

        $data['status'] =
            $data['status']
            ?? 'active';

        return Patient::create(
            $data
        );
    }

    public function update(
        Patient $patient,
        array $data
    ): Patient {
        $patient->update(
            $data
        );

        return $patient->fresh();
    }

    private function generatePatientNumber(): string
    {
        do {
            $number =
                'PT-' .
                Str::upper(
                    Str::random(8)
                );
        } while (
            Patient::where(
                'patient_number',
                $number
            )->exists()
        );

        return $number;
    }
}