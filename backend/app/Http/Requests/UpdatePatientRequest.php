<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patient =
            $this->route('patient');

        return [
            'user_id' => [
                'nullable',
                'exists:users,id',

                Rule::unique(
                    'patients',
                    'user_id'
                )->ignore(
                    $patient?->id
                ),
            ],

            'first_name' => [
                'required',
                'string',
                'max:255',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'last_name' => [
                'required',
                'string',
                'max:255',
            ],

            'suffix' => [
                'nullable',
                'string',
                'max:50',
            ],

            'birth_date' => [
                'required',
                'date',
                'after_or_equal:1900-01-01',
                'before_or_equal:today',
            ],

            'sex' => [
                'required',
                Rule::in([
                    'male',
                    'female',
                ]),
            ],

            'phone_number' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],

            'street_address' => [
                'nullable',
                'string',
                'max:255',
            ],

            'barangay' => [
                'nullable',
                'string',
                'max:255',
            ],

            'city' => [
                'nullable',
                'string',
                'max:255',
            ],

            'province' => [
                'nullable',
                'string',
                'max:255',
            ],

            'blood_type' => [
                'nullable',
                'string',
                'max:10',
            ],

            'emergency_contact_name' => [
                'nullable',
                'string',
                'max:255',
            ],

            'emergency_contact_relationship' => [
                'nullable',
                'string',
                'max:255',
            ],

            'emergency_contact_phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'active',
                    'inactive',
                ]),
            ],
        ];
    }
}