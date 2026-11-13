<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabRequest extends Model
{
    protected $fillable = [
        'consultation_id',
        'requested_by',
        'clinical_indication',
        'instructions',
    ];

    protected function casts(): array
    {
        return [
            'issued_at' => 'datetime',
        ];
    }

    // Consultation associated with this laboratory request.
    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }

    // Doctor who created the laboratory request.
    public function requestingDoctor()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    // Doctor who issued the laboratory request.
    public function issuingDoctor()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    // Multiple examinations in one laboratory request.
    public function items()
    {
        return $this->hasMany(LabRequestItem::class);
    }
}
