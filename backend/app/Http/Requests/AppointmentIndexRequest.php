<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppointmentIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'status' => [
                'nullable',
                Rule::in([
                    'all',
                    'scheduled',
                    'checked_in',
                    'completed',
                    'cancelled',
                    'no_show',
                ]),
            ],

            'type' => [
                'nullable',
                Rule::in([
                    'all',
                    'online',
                    'walk_in',
                ]),
            ],

            'date' => [
                'nullable',
                'date',
            ],

            'doctor_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ];
    }
}