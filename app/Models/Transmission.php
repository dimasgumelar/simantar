<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transmission extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'address',
        'latitude',
        'longitude',
        'is_active',
        'is_power_out',
        'photo_path',
        'description',
        'transmission_type',
        'koordinator_id',
    ];

    public function koordinator()
    {
        return $this->belongsTo(User::class, 'koordinator_id');
    }

    public function logbooks()
    {
        return $this->hasMany(Logbook::class);
    }
}
