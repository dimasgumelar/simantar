<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonitoringPeralatan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tb_monitoring_peralatan';

    protected $fillable = [
        'transmission_id',
        'inventory_id',
        'result',
    ];
}
