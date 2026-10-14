<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QueueEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'doctor_id',
        'created_by',
        'queue_number',
        'queue_date',
        'priority',
        'priority_reason',
        'status',
        'doctor_available_at',
        'estimated_wait_minutes',
        'queued_at',
        'called_at',
        'consultation_started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'queue_date' => 'date',
            'doctor_available_at' => 'datetime',
            'estimated_wait_minutes' => 'integer',
            'queued_at' => 'datetime',
            'called_at' => 'datetime',
            'consultation_started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}