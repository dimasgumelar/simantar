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
        Schema::create('tb_mdp_monitoring', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mp_id')->constrained('tb_mp_monitoring')->onDelete('cascade');
            $table->string('nama_detail');
            $table->string('key_detail');
            $table->string('tipe_inputan');
            $table->decimal('satuan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_mdp_monitoring');
    }
};
