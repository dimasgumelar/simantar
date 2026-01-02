<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MasterShift extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tb_master_shift';

    protected $fillable = [
        'nama_shift',
        'jam_mulai_shift',
        'jam_akhir_shift',
    ];
}
