<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenancePeralatan extends Model
{
    protected $table = 'tb_maintenance_peralatan';

    protected $fillable = [
        'transmission_id',
        'id_peralatan',
        'result',
    ];
}
