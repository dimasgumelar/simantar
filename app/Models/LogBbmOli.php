<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogBbmOli extends Model
{
     protected $table = 'tb_log_bbm_oli';

    protected $fillable = [
        'kategori',
        'user_id',
        'id_transmisi',
        'id_data_genset',
        'tanggal',
        'total_solar_oli',
        'keterangan',
    ];
}
