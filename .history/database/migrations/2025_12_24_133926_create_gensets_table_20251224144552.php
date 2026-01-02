<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_monitoring_genset', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->date('tanggal');
            $table->foreignId('id_transmisi');
            $table->time('jam_mulai');
            $table->time('jam_akhir');
            $table->integer('durasi');
            $table->foreignId('id_data_genset');
            $table->string('tegangan_rs');
            $table->string('tegangan_st');
            $table->string('tegangan_tr');
            $table->string('tegangan_rn');
            $table->string('tegangan_sn');
            $table->string('tegangan_tn');
            $table->string('tegangan_aki');
            $table->integer('beban_genset');
            $table->string('kondisi_oli');
            $table->string('link_foto');
            $table->integer('konsumsi_bbm');
            $table->string('kategori');
            $table->timestamps();
        });

        
        Schema::create('tb_master_data_genset', function (Blueprint $table) {
            $table->id();
            $table->string('tipe_genset');
            $table->string('merek_genset');
            $table->integer('kapasitas_daya_kva');
            $table->integer('kapasitas_daya_kwh');
            $table->string('model_mesin');
            $table->string('rate_model');
            $table->timestamps();
        });

        Schema::create('tb_log_bbm_oli', function (Blueprint $table) {
            $table->id();
            $table->string('kategori');
            $table->foreignId('id_user');
            $table->foreignId('id_transmisi');
            $table->date('tanggal');
            $table->integer('total_solar_oli');
            $table->string('keterangan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_monitoring_genset');
        Schema::dropIfExists('tb_master_data_genset');
        Schema::dropIfExists('tb_log_bbm_oli');
    }
};
