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
        Schema::create('tb_master_detail_peralatan_maintenance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('master_peralatan_id')->constrained()->onDelete('cascade');
            $table->string('nama_detail');
            $table->string('key_detail');
            $table->integer('tipe_inputan');
            $table->string('satuan');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_master_detail_peralatan_maintenance');
    }
};
