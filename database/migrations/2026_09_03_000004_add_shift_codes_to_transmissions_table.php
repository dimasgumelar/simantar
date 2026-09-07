<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transmissions', function (Blueprint $table) {
            $table->json('shift_codes')->nullable()->after('admin_transmisi_id');
        });
    }

    public function down(): void
    {
        Schema::table('transmissions', function (Blueprint $table) {
            $table->dropColumn('shift_codes');
        });
    }
};
