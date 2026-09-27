<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'staff_number',
        'position',
        'department',
        'phone',
        'address',
        'date_hired',
        'emergency_contact_name',
        'emergency_contact_number',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_hired' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}