<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogbookPower extends Model
{
    protected $fillable = [
        'logbook_id',
        'power',
    ];

    public function logbook()
    {
        return $this->belongsTo(Logbook::class);
    }
}
