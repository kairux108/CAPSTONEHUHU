<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrescriptionItem extends Model
{
    protected $fillable = [
        'prescription_id',
        'medicine',
        'strength',
        'dosage',
        'frequency',
        'duration_days',
        'duration',
        'instructions',
    ];

    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',
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
