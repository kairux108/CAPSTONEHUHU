<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VitalSign extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'appointment_id',
        'recorded_by',
        'blood_pressure_systolic',
        'blood_pressure_diastolic',
        'oxygen_saturation',
        'temperature',
        'heart_rate',
        'respiratory_rate',
        'weight',
        'height',
    ];

    protected function casts(): array
    {
        return [
            'blood_pressure_systolic' => 'integer',
            'blood_pressure_diastolic' => 'integer',
            'oxygen_saturation' => 'integer',
            'temperature' => 'float',
            'heart_rate' => 'integer',
            'respiratory_rate' => 'integer',
            'weight' => 'float',
            'height' => 'float',
        ];
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function recorder()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}