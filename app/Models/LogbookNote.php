<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogbookNote extends Model
{
    const CATEGORIES = ['siaran', 'bbm', 'lainnya'];

    protected $fillable = [
        'logbook_id',
        'category',
        'start_time',
        'end_time',
        'notes',
    ];

    public function logbook()
    {
        return $this->belongsTo(Logbook::class);
    }
}
