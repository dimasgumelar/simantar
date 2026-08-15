<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('logbooks', function (Blueprint $table) {
            $table->foreignId('approved_by')->nullable()->after('tanggal')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        // Carry existing single-petugas/signature data over to the new
        // logbook_petugas pivot (and to approved_by/approved_at when the
        // signer wasn't the petugas, i.e. it was the koordinator) before
        // the old columns are dropped.
        $now = now();
        foreach (DB::table('logbooks')->get() as $logbook) {
            DB::table('logbook_petugas')->insert([
                'logbook_id' => $logbook->id,
                'user_id' => $logbook->petugas_id,
                'signed_at' => $logbook->signed_by === $logbook->petugas_id ? $logbook->signed_at : null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            if ($logbook->signed_by && $logbook->signed_by !== $logbook->petugas_id) {
                DB::table('logbooks')->where('id', $logbook->id)->update([
                    'approved_by' => $logbook->signed_by,
                    'approved_at' => $logbook->signed_at,
                ]);
            }
        }

        Schema::table('logbooks', function (Blueprint $table) {
            $table->dropForeign(['petugas_id']);
            $table->dropForeign(['signed_by']);
            $table->dropColumn(['petugas_id', 'signed_by', 'signed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logbooks', function (Blueprint $table) {
            $table->foreignId('petugas_id')->nullable()->after('tanggal')->constrained('users')->nullOnDelete();
            $table->foreignId('signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('signed_at')->nullable();
        });

        foreach (DB::table('logbooks')->get() as $logbook) {
            $petugas = DB::table('logbook_petugas')->where('logbook_id', $logbook->id)->first();
            if ($petugas) {
                DB::table('logbooks')->where('id', $logbook->id)->update([
                    'petugas_id' => $petugas->user_id,
                    'signed_by' => $petugas->signed_at ? $petugas->user_id : $logbook->approved_by,
                    'signed_at' => $petugas->signed_at ?? $logbook->approved_at,
                ]);
            }
        }

        Schema::table('logbooks', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropColumn(['approved_by', 'approved_at']);
        });
    }
};
