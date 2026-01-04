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
        Schema::create('md_peralatan_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('m_peralatan_maintenance_id')->constrained()->onDelete('cascade');
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
        Schema::dropIfExists('md_peralatan_maintenances');
    }
};
