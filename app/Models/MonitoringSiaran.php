<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class MonitoringSiaran extends Model
{
    use HasFactory;

    protected $table = 'monitoring_siaran';

    protected $fillable = [
        'user_id',
        'id_transmisi',
        'id_konten',
        'sumber_input',
        'nama_acara',
        'kategori',
        'jam_mulai',
        'hasil',
        'jenis_gangguan',
        'penyebab_gangguan',
        'penanganan_gangguan',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
