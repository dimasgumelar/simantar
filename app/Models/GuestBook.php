<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestBook extends Model
{
    protected $fillable = [
        'logbook_id',
        'name',
        'institution',
        'purpose',
        'phone',
        'time_in',
        'time_out',
        'notes',
    ];

    public function logbook()
    {
        return $this->belongsTo(Logbook::class);
    }
}
