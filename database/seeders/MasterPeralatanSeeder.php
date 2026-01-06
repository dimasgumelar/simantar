<?php

namespace Database\Seeders;

use App\Models\MasterPeralatanMaintenance;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterPeralatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $masterPeralatans = [
            ["nama_peralatan" => "IRD"],
            ["nama_peralatan" => "MUX"],
            ["nama_peralatan" => "PA"],
            ["nama_peralatan" => "ENCODER"],
            ["nama_peralatan" => "PARABOLA"],
            ["nama_peralatan" => "SWITCHER"],
            ["nama_peralatan" => "MONITOR"],
            ["nama_peralatan" => "AKI GENSET"],
            ["nama_peralatan" => "HEAT EXCHANGER"],
            ["nama_peralatan" => "TX SWITCHING"],
        ];

        foreach ($masterPeralatans as $masterPeralatan) {
            MasterPeralatanMaintenance::create($masterPeralatan);
        }
    }
}
