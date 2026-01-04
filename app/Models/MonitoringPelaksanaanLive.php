<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonitoringPelaksanaanLive extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tanggal_pelaksanaan',
        'nama_acara',
        'lokasi',
        'kesiapan_peralatan',
        'detail_peralatan',
        'kondisi_uji_coba',
        'catatan_uji_coba',
        'stabilitas_sinyal',
        'kualitas_av_ke_mcr',
        'kendala_teknis',
        'langkah_penanganan',
        'durasi_gangguan',
        'proses_shutdown',
        'kondisi_akhir_peralatan',
        'foto',
        'user_id',
    ];

    protected $casts = [
        'detail_peralatan' => 'array',
        'tanggal_pelaksanaan' => 'date',
    ];

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor untuk rating (jika diperlukan di tampilan)
    public function getRatingStabilitasAttribute()
    {
        $ratings = [
            '1' => 'Sangat Buruk',
            '2' => 'Buruk',
            '3' => 'Cukup',
            '4' => 'Baik',
            '5' => 'Sangat Baik',
        ];
        
        // Pastikan stabilitas_sinyal adalah string untuk key array
        $key = (string) $this->stabilitas_sinyal;
        return $ratings[$key] ?? 'Tidak dinilai';
    }

    public function getRatingKualitasAvAttribute()
    {
        $ratings = [
            '1' => 'Sangat Buruk',
            '2' => 'Buruk',
            '3' => 'Cukup',
            '4' => 'Baik',
            '5' => 'Sangat Baik',
        ];
        
        $key = (string) $this->kualitas_av_ke_mcr;
        return $ratings[$key] ?? 'Tidak dinilai';
    }
}