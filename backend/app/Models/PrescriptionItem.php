<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrescriptionItem extends Model
{
    protected $fillable = [
        'prescription_id',

        // Existing prescription details
        'medicine',
        'strength',
        'dosage',
        'frequency',
        'duration_days',
        'duration',
        'instructions',

        // Flexible medication scheduling
        'schedule_type',
        'as_needed',
        'administration_times',
        'interval_hours',
        'interval_scope',
        'meal_relation',
        'timing_instructions',
    ];

    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',

            // Whether the medication is taken as needed (PRN)
            'as_needed' => 'boolean',

            // Example: ["08:00", "20:00"]
            'administration_times' => 'array',

            // Example: every 4 hours
            'interval_hours' => 'integer',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }
}
