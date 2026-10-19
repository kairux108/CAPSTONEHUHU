<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{
    public function registerPatient(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $fullName = $this->buildFullName($data);

            $user = User::create([
                'name' => $fullName,
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => 'patient',
                'status' => 'active',
            ]);

            $patient = Patient::create([
                'user_id' => $user->id,
                'patient_number' => $this->generatePatientNumber(),

                'first_name' => $data['first_name'],
                'middle_name' => $data['middle_name'] ?? null,
                'last_name' => $data['last_name'],

                'birth_date' => $data['birth_date'],
                'sex' => $data['sex'],

                'phone_number' => $data['phone_number'],
                'email' => $data['email'],

                'status' => 'active',
            ]);

            return [
                'user' => $user,
                'patient' => $patient,
            ];
        });
    }

    public function attemptLogin(
        string $email,
        string $password
    ): ?User {
        $user = User::where('email', $email)->first();

        if (
            !$user ||
            !Hash::check($password, $user->password)
        ) {
            return null;
        }

        return $user;
    }

    private function buildFullName(array $data): string
    {
        return collect([
            $data['first_name'],
            $data['middle_name'] ?? null,
            $data['last_name'],
        ])
            ->filter()
            ->implode(' ');
    }

    private function generatePatientNumber(): string
    {
        do {
            $patientNumber =
                'CURA-' .
                now()->format('Ymd') .
                '-' .
                Str::upper(Str::random(6));
        } while (
            Patient::where(
                'patient_number',
                $patientNumber
            )->exists()
        );

        return $patientNumber;
    }
}