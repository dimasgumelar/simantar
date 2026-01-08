<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            TransmissionSeeder::class,
            CategorySeeder::class,
            InventorySeeder::class,
            MaintenanceSeeder::class,
            MaintenanceStatusHistorySeeder::class,
            UserTransmissionSeeder::class,
            MasterPeralatanSeeder::class,
            SisabbmSeeder::class,
            MasterDataGensetSeeder::class,
        ]);
    }
}
