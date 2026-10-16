<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQueueEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'priority' => [
                'sometimes',
                'in:normal,priority,emergency',
            ],

            'priority_reason' => [
                'nullable',
                'string',
                'max:500',
            ],

            'doctor_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],

            'doctor_available_at' => [
                'nullable',
                'date',
            ],

            'estimated_wait_minutes' => [
                'nullable',
                'integer',
                'min:0',
                'max:1440',
            ],

            'status' => [
                'sometimes',
                'in:waiting,cancelled',
            ],
        ];
    }
}