<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->dropColumn('shift');
        });

        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->string('shift', 30)->after('date');
        });
    }

    public function down(): void
    {
        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->dropColumn('shift');
        });

        Schema::table('duty_schedules', function (Blueprint $table) {
            $table->enum('shift', ['1', '2', '3', 'libur'])->after('date');
        });
    }
};
