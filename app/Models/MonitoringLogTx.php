<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonitoringLogTx extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tb_monitoring_log_tx';

    protected $fillable = [
        'transmission_id',
        'user_id',
        'shift_id',
        'nilai_power',
        'nilai_reflact',
        'nilai_bitrate',
        'tegangan_rs',
        'tegangan_st',
        'tegangan_tr',
        'suhu_pemancar',
        'suhu_ruang',
        'kelembapan',
        'status_pemancar',
        'link_foto',
        'nilai_vswr'
    ];
}
