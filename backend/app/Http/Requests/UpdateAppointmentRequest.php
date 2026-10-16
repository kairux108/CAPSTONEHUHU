<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
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
                'sometimes',
                'required',
                'date',
                'after_or_equal:today',
            ],

            'appointment_time' => [
                'sometimes',
                'required',
                'date_format:H:i',
            ],

            'reason_for_visit' => [
                'nullable',
                'string',
                'max:1000',
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    'scheduled',
                    'completed',
                    'cancelled',
                    'no_show',
                ]),
            ],
        ];
    }
}