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
        Schema::create('gensets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->date('tanggal');
            $table->foreignId('id_transmisi');
            $table->time('jam_mulai');
            $table->time('jam_akhir');
            $table->int('durasi');
            $table->foreignId('id_data_genset');
            $table->string('tegangan_rs');
            $table->string('tegangan_st');
            $table->string('tegangan_tr');
            $table->string('tegangan_rn');
            $table->string('tegangan_sn');
            $table->string('tegangan_tn');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gensets');
    }
};
