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
        Schema::create(table: 'tb_fsm', callback: function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'id_user')->constrained()->onDelete(action: 'cascade');
            $table->date(column: 'tanggal_fsm');
            $table->string(column: 'nama_tp_fsm');
            $table->integer(column: 'lat');
            $table->integer(column: 'long');
            $table->string(column: 'id_lokasi_pemancar');
            $table->integer(column: 'alt');
            $table->tinyInteger(column: 'ketinggian_antena');
            $table->integer(column: 'hasil_e');
            $table->integer(column: 'hasil_cn');
            $table->integer(column: 'hasil_mer');
            $table->integer(column: 'hasil_lm');
            $table->integer(column: 'hasil_ber');
            $table->string(column: 'kualitas_audio');
            $table->text(column: 'link_foto');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create(table: 'tb_master_area_siaran', callback: function (Blueprint $table) {
            $table->id();
            $table->string(column: 'nama');
            $table->text(column: 'detail_area')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_fsms');
        Schema::dropIfExists('tb_master_area_siaran');

    }
};
