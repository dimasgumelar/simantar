<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterGenset extends Model
{
     protected $table = 'tb_master_data_genset';
    //public $timestamps = false;

    protected $fillable = [
        'id',
        'id_transmisi',
        'tipe_genset',
        'merek_genset',
        'kapasitas_daya_kva',
        'kapasitas_daya_kwh',
        'model_mesin',
        'rate_model',
    ];
}
