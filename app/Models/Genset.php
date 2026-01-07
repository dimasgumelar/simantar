<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genset extends Model
{
    protected $table = 'tb_monitoring_genset';
    protected $fillable = [
            'user_id',
            'tanggal',
            'id_transmisi',
            'jam_mulai',
            'jam_akhir',
            'durasi',
            'id_data_genset',
            'tegangan_rs',
            'tegangan_st',
            'tegangan_tr',
            'tegangan_rn',
            'tegangan_sn',
            'tegangan_tn',
            'tegangan_aki',
            'beban_genset',
            'kondisi_oli',
            'link_foto',
            'konsumsi_bbm',
            'kategori',
    ];

}
