<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PatientProfileService
{
    public function getProfile(User $user): ?Patient
    {
        return Patient::where('user_id', $user->id)
            ->first();
    }

    public function updateProfile(
        User $user,
        array $data
    ): Patient {
        return DB::transaction(function () use ($user, $data) {

            $patient = Patient::where(
                'user_id',
                $user->id
            )->firstOrFail();

            $fullName = collect([
                $data['first_name'],
                $data['middle_name'] ?? null,
                $data['last_name'],
            ])
                ->filter()
                ->implode(' ');

            $user->update([
                'name' => $fullName,
                'email' => $data['email'],
            ]);

            $patient->update([
                'first_name' =>
                    $data['first_name'],

                'middle_name' =>
                    $data['middle_name'] ?? null,

                'last_name' =>
                    $data['last_name'],

                'birth_date' =>
                    $data['birth_date'],

                'sex' =>
                    $data['sex'],

                'phone_number' =>
                    $data['phone_number'],

                'email' =>
                    $data['email'],

                'street_address' =>
                    $data['address'] ?? null,

                'city' =>
                    $data['city'] ?? null,

                'province' =>
                    $data['province'] ?? null,

                'blood_type' =>
                    $data['blood_type'] ?? null,

                'emergency_contact_name' =>
                    $data['emergency_contact_name'] ?? null,

                'emergency_contact_phone' =>
                    $data['emergency_contact_number'] ?? null,
            ]);

            return $patient->fresh();
        });
    }
}