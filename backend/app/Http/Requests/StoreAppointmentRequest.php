<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => [
                'required',
                'exists:patients,id',
            ],

            'doctor_id' => [
                'nullable',
                Rule::exists(
                    'users',
                    'id'
                )->where(
                    fn ($query) =>
                        $query
                            ->where(
                                'role',
                                'doctor'
                            )
                            ->where(
                                'status',
                                'active'
                            )
                ),
            ],

            'appointment_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'appointment_time' => [
                'required',
                'date_format:H:i',
            ],

            'appointment_type' => [
                'required',
                Rule::in([
                    'online',
                    'walk_in',
                ]),
            ],

            'reason_for_visit' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}