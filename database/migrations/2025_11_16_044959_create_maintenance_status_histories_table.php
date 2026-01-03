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
        Schema::create('maintenance_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maintenance_id')->constrained('maintenances')->onDelete('cascade');
            $table->integer('status'); // 0 pending, 1 in progress, 2 completed, 3 approved, 4 rejected
            $table->text('note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_status_histories');
    }
};