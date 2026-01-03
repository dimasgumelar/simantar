<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintenance_id',
        'status',
        'note',
        'created_by',
    ];

    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}