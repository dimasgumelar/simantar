<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('monitoring_siaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('id_transmisi');
            $table->string('id_konten');
            $table->string('sumber_input');
            $table->string('nama_acara');
            $table->enum('kategori', ['Live','Record']);
            $table->time('jam_mulai');
            $table->enum('hasil', ['Normal','Gangguan']);
            $table->string('jenis_gangguan')->nullable();
            $table->text('penyebab_gangguan')->nullable();
            $table->text('penanganan_gangguan')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('monitoring_siaran');
    }
};
