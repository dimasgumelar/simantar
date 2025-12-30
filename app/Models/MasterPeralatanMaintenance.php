<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPeralatanMaintenance extends Model
{
    protected $table = 'tb_master_peralatan_maintenance';

    protected $fillable = [
        'nama_peralatan',
    ];
}
