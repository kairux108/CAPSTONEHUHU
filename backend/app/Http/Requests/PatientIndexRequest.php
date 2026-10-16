<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PatientIndexRequest extends FormRequest
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
                    'active',
                    'inactive',
                ]),
            ],

            'sex' => [
                'nullable',
                Rule::in([
                    'all',
                    'male',
                    'female',
                ]),
            ],

            'age_group' => [
                'nullable',
                Rule::in([
                    'all',
                    'child',
                    'adult',
                    'senior',
                ]),
            ],

            'sort' => [
                'nullable',
                Rule::in([
                    'name',
                    'newest',
                    'oldest',
                ]),
            ],
        ];
    }
}
