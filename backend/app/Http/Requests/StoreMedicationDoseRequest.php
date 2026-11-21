<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicationDoseRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only authenticated patient accounts
        // may submit their own medication records.
        return $this->user()?->role === 'patient';
    }

    public function rules(): array
    {
        return [
            // Prescription ownership will be verified
            // using the authenticated patient in the controller.
            'prescription_item_id' => [
                'required',
                'integer',
                'min:1',
            ],

            // Prevent repeated network requests from
            // recording the same confirmation twice.
            'request_id' => [
                'required',
                'uuid',
            ],

            // Patient-reported time, including timezone.
            // Example: 2026-11-18T20:30:00+08:00

            'taken_at' => [
                'required',
                'date_format:Y-m-d\TH:i:sP,Y-m-d\TH:i:s.vP,Y-m-d\TH:i:s.v\Z',
            ],


            // These fields must always be assigned
            // or calculated by the backend.
            'patient_id' => [
                'prohibited',
            ],

            'recorded_by_user_id' => [
                'prohibited',
            ],

            'scheduled_for' => [
                'prohibited',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'prescription_item_id.required' =>
                'Please select a prescribed medication.',

            'request_id.uuid' =>
                'Invalid medication confirmation identifier.',

            'taken_at.required' =>
                'Please provide the time the medication was taken.',

            'taken_at.date_format' =>
                'Medication time must include a valid date, time, and timezone.',
        ];
    }
}
