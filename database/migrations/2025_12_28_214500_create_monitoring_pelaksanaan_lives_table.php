<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('monitoring_pelaksanaan_lives', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal_pelaksanaan');
            $table->string('nama_acara');
            $table->string('lokasi');
            $table->enum('kesiapan_peralatan', ['Sangat Siap', 'Cukup', 'Kurang Siap']);
            $table->json('detail_peralatan')->nullable();
            $table->enum('kondisi_uji_coba', ['Ya, Dilakukan dan Berjalan Baik', 'Ya Dilakukan tetapi terdapat kendala', 'Tidak Dilakukan']);
            $table->text('catatan_uji_coba')->nullable();
            $table->integer('stabilitas_sinyal');
            $table->integer('kualitas_av_ke_mcr');
            $table->text('kendala_teknis')->nullable();
            $table->text('langkah_penanganan')->nullable();
            $table->string('durasi_gangguan')->nullable();
            $table->enum('proses_shutdown', ['Sesuai prosedur', 'Ada Kendala minor', 'Tidak Sesuai prosedur']);
            $table->enum('kondisi_akhir_peralatan', ['Baik dan berfungsi normal', 'Ada Kerusakan ringan', 'Perlu perbaikan /servis']);
            $table->string('foto')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('monitoring_pelaksanaan_lives');
    }
};