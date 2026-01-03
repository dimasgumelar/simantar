<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonitoringLive extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tanggal_persiapan',
        'nama_acara',
        'lokasi',
        'detail_peralatan',
        'kondisi_pc',
        'kendala_pc',
        'stl_internet',
        'kendala_internet',
        'kondisi_input_sdi',
        'kendala_sdi',
        'jumlah_tegangan_listrik',
        'koneksi_srt',
        'kendala_srt',
        'koneksi_rtmp',
        'kendala_rtmp',
        'sinyal_audio_video',
        'kendala_sinyal_av',
        'asal_sumber_listrik',
        'uji_komunikasi',
        'uji_sinyal_av_ke_studio',
        'hasil_uji_tx',
        'monitoring_kualitas_link',
        'backup_sistem_tx',
        'catatan_kendala',
        'foto',
        'user_id',
    ];

    protected $casts = [
        'detail_peralatan' => 'array',
        'tanggal_persiapan' => 'date',
    ];

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor untuk status tegangan
    public function getStatusTeganganAttribute()
    {
        $tegangan = $this->jumlah_tegangan_listrik;
        return ($tegangan >= 198 && $tegangan <= 242) ? 'Normal' : 'Tidak Normal';
    }
}