<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterDetailPeralatanMaintenance extends Model
{
    protected $table = 'tb_master_detail_peralatan_maintenance';

    protected $fillable = [
        'id_master_peralatan',
        'nama_detail',
        'key_detail',
        'tipe_inputan',
        'satuan',
    ];
}
