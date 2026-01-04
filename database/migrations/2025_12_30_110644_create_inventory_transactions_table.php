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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('pic_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('inventory_id')->constrained()->onDelete('cascade');
            $table->string('photo_path')->nullable();
            $table->tinyInteger('status'); // 1: Pinjam, 2: Serahkan ke Transmisi, 3: Serahkan ke Pihak Ketiga, 4: Kembalikan, 5: Alat Baru, 6: Alat dari Transmisi Lain 
            $table->text('description')->nullable();
            $table->foreignId('transmission_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_transactions');
    }
};