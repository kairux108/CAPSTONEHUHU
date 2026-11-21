<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicationDoseLog extends Model
{
    protected $table = 'medication_dose_logs';

    protected $fillable = [
        'patient_id',
        'prescription_item_id',
        'recorded_by_user_id',
        'taken_at',
        'scheduled_for',
        'request_id',
    ];

    protected function casts(): array
    {
        return [
            'taken_at' => 'immutable_datetime',
            'scheduled_for' => 'immutable_datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function prescriptionItem(): BelongsTo
    {
        return $this->belongsTo(
            PrescriptionItem::class
        );
    }

    public function recordedByUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'recorded_by_user_id'
        );
    }
}
