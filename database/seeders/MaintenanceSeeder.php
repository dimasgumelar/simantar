<?php

namespace Database\Seeders;

use App\Models\Maintenance;
use Illuminate\Database\Seeder;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $maintenances = [
            ['inventory_id' => 1, 'transmission_id' => 1, 'user_id' => 1, 'description' => 'Initial maintenance check', 'scheduled_at' => now()->addDays(1), "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 2, 'transmission_id' => 2, 'user_id' => 2, 'description' => 'Routine maintenance in progress', 'scheduled_at' => now()->addDays(1), "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 3, 'transmission_id' => 2, 'user_id' => 3, 'description' => 'Maintenance completed successfully', 'scheduled_at' => now()->addDays(1), "schedule_response" => "json", "created_by" => 1],
            ['inventory_id' => 5, 'transmission_id' => 3, 'user_id' => 4, 'description' => 'Scheduled maintenance pending', 'scheduled_at' => now()->addDays(1), "schedule_response" => "json", "created_by" => 1],
        ];

        foreach ($maintenances as $maintenance) {
            Maintenance::create($maintenance);
        }
    }
}