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
        Schema::create('tb_monitoring_log_tx', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transmission_id')->constrained('transmissions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('shift_id')->constrained('tb_master_shift')->onDelete('cascade');
            $table->decimal('nilai_power')->nullable();
            $table->decimal('nilai_reflact')->nullable();
            $table->decimal('nilai_bitrate')->nullable();
            $table->decimal('tegangan_rs')->nullable();
            $table->decimal('tegangan_st')->nullable();
            $table->decimal('tegangan_tr')->nullable();
            $table->decimal('suhu_pemancar')->nullable();
            $table->decimal('suhu_ruang')->nullable();
            $table->decimal('kelembapan')->nullable();
            $table->string('status_pemancar')->nullable();
            $table->string('link_foto')->nullable();
            $table->decimal('nilai_vswr')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_monitoring_log_tx');
    }
};
