<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterPeralatanMonitoring extends Model
{
    use HasFactory;

    protected $table = 'tb_mp_monitoring';

    protected $fillable = [
        'nama_peralatan',
    ];
}
