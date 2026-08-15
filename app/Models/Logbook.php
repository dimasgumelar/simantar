<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Logbook extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'transmission_id',
        'tanggal',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class);
    }

    public function petugasList()
    {
        return $this->belongsToMany(User::class, 'logbook_petugas')
            ->withPivot('id', 'signed_at')
            ->withTimestamps();
    }

    public function events()
    {
        return $this->hasMany(LogbookEvent::class);
    }

    public function notes()
    {
        return $this->hasMany(LogbookNote::class);
    }

    public function powers()
    {
        return $this->hasMany(LogbookPower::class);
    }
}
