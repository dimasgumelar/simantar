<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('monitoring_lives', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_persiapan');
            $table->string('nama_acara');
            $table->string('lokasi');
            $table->json('detail_peralatan');
            $table->enum('kondisi_pc', ['Normal', 'Terdapat Kendala']);
            $table->text('kendala_pc')->nullable();
            $table->enum('stl_internet', ['Normal', 'Terdapat Kendala']);
            $table->text('kendala_internet')->nullable();
            $table->enum('kondisi_input_sdi', ['Normal', 'Terdapat Kendala']);
            $table->text('kendala_sdi')->nullable();
            $table->integer('jumlah_tegangan_listrik');
            $table->enum('koneksi_srt', ['Normal', 'Terdapat Kendala'])->nullable();
            $table->text('kendala_srt')->nullable();
            $table->enum('koneksi_rtmp', ['Normal', 'Terdapat Kendala'])->nullable();
            $table->text('kendala_rtmp')->nullable();
            $table->enum('sinyal_audio_video', ['Normal', 'Terdapat Kendala']);
            $table->text('kendala_sinyal_av')->nullable();
            $table->enum('asal_sumber_listrik', ['PLN', 'Genset']);
            $table->enum('uji_komunikasi', ['Sangat Lancar', 'Cukup Lancar', 'Kurang Lancar']);
            $table->enum('uji_sinyal_av_ke_studio', ['Ya', 'Tidak']);
            $table->enum('hasil_uji_tx', ['Sinyal Stabil dan jernih', 'Ada noise ringan', 'Sinyal tidak stabil']);
            $table->enum('monitoring_kualitas_link', ['Ya', 'Tidak']);
            $table->enum('backup_sistem_tx', ['Ya', 'Tidak']);
            $table->text('catatan_kendala')->nullable();
            $table->string('foto')->nullable();
            
            // Foreign key dan timestamps
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('monitoring_lives');
    }
};