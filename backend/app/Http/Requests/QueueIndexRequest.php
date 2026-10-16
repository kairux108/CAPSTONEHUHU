<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QueueIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => [
                'nullable',
                'date',
            ],

            'status' => [
                'nullable',
                'in:waiting,called,in_consultation,completed,cancelled',
            ],

            'priority' => [
                'nullable',
                'in:normal,priority,emergency',
            ],

            'appointment_type' => [
                'nullable',
                'in:walk_in,online',
            ],

            'doctor_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'search' => [
                'nullable',
                'string',
                'max:100',
            ],

            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100',
            ],
        ];
    }
}