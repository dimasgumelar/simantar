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
        Schema::table('transmissions', function (Blueprint $table) {
            $table->foreignId('koordinator_id')->nullable()->after('transmission_type')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transmissions', function (Blueprint $table) {
            $table->dropForeign(['koordinator_id']);
            $table->dropColumn('koordinator_id');
        });
    }
};
