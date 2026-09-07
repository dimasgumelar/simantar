<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transmissions', function (Blueprint $table) {
            $table->foreignId('admin_transmisi_id')->nullable()->after('koordinator_id')
                ->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('transmissions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('admin_transmisi_id');
        });
    }
};
