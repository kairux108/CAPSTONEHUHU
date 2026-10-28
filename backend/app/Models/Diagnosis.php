<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    protected $fillable = [
        'consultation_id',
        'name',
        'notes',
        'reviewed',
    ];

    protected function casts(): array
    {
        return [
            'reviewed' => 'boolean',
        ];
    }

    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}
