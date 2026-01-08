<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SisaBbm extends Model
{
    //use SoftDeletes;
    use HasFactory, SoftDeletes;

    protected $table = 'tb_sisa_bbm';

    protected $fillable = [
        'id_transmisi',
        'sisa_bbm',
    ];

}
