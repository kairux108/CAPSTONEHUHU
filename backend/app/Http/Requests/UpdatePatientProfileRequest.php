<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'patient';
    }

    public function rules(): array
    {
        return [
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

            'birth_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'sex' => [
                'required',
                'in:male,female',
            ],

            'phone_number' => [
                'required',
                'string',
                'max:30',
            ],

            'email' => [
                'required',
                'email',
                'max:255',

                Rule::unique(
                    'users',
                    'email'
                )->ignore(
                    $this->user()?->id
                ),
            ],

            'address' => [
                'nullable',
                'string',
                'max:500',
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

            'emergency_contact_number' => [
                'nullable',
                'string',
                'max:30',
            ],
        ];
    }
}