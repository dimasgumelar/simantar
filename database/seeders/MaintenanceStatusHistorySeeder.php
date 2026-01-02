<?php

namespace Database\Seeders;

use App\Models\MaintenanceStatusHistory;
use Illuminate\Database\Seeder;

class MaintenanceStatusHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $maintenances = [
            ['maintenance_id' => 1, 'status' => 0, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 1, 'status' => 1, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 1, 'status' => 2, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 1, 'status' => 3, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 2, 'status' => 0, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 3, 'status' => 0, 'note' => "TESS", "created_by" => 1],
            ['maintenance_id' => 4, 'status' => 0, 'note' => "TESS", "created_by" => 1],
        ];

        foreach ($maintenances as $maintenance) {
            MaintenanceStatusHistory::create($maintenance);
        }
    }
}