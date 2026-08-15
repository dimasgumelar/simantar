<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogbookEvent extends Model
{
    protected $fillable = [
        'logbook_id',
        'name',
        'start_time',
        'end_time',
    ];

    public function logbook()
    {
        return $this->belongsTo(Logbook::class);
    }
}
