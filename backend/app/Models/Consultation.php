<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    protected $fillable = [
        'queue_entry_id',
        'doctor_id',
        'status',
        'subjective',
        'objective',
        'assessment',
        'plan',
        'care_instructions',
        'follow_up_instructions',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function queueEntry()
    {
        return $this->belongsTo(QueueEntry::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function diagnosis()
    {
        return $this->hasOne(Diagnosis::class);
    }

    public function prescription()
    {
        return $this->hasOne(Prescription::class);
    }
}
