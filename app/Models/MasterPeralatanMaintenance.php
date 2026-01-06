<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterPeralatanMaintenance extends Model
{
    protected $table = 'm_peralatan_maintenances';
    public $timestamps = false;

    protected $fillable = [
        'nama_peralatan',
    ];
}
