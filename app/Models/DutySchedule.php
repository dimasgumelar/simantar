<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DutySchedule extends Model
{
    protected $fillable = [
        'transmission_id',
        'user_id',
        'date',
        'shift',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function transmission()
    {
        return $this->belongsTo(Transmission::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
