<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQueueEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'appointment_id' => [
                'required',
                'integer',
                'exists:appointments,id',
            ],

            'priority' => [
                'nullable',
                'in:normal,priority,emergency',
            ],

            'priority_reason' => [
                'nullable',
                'string',
                'max:500',
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
        ];
    }
}