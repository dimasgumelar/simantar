<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterDetailPeralatanMonitoring extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $table = 'tb_mdp_monitoring';

    protected $fillable = [
        'mp_id',
        'nama_detail',
        'key_detail',
        'tipe_inputan',
        'satuan',
    ];
}
