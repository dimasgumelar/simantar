<?php

namespace Database\Seeders;

use App\Models\MasterGenset;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterDataGensetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'id_transmisi' => 7,
                'tipe_genset' => '4-Stroke Diesel',
                'merek_genset' => 'PERKINS',
                'kapasitas_daya_kva' => 16.00,
                'kapasitas_daya_kwh' => 12.80,
                'model_mesin' => 'P16.5D5',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 8,
                'tipe_genset' => '4JA1',
                'merek_genset' => 'ISUZU',
                'kapasitas_daya_kva' => 30.00,
                'kapasitas_daya_kwh' => 24.00,
                'model_mesin' => 'PG30-1',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 10,
                'tipe_genset' => '4045TF120',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 66.00,
                'kapasitas_daya_kwh' => 52.80,
                'model_mesin' => 'J0066K',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 5,
                'tipe_genset' => '2510/1500',
                'merek_genset' => 'PERKINS',
                'kapasitas_daya_kva' => 50.00,
                'kapasitas_daya_kwh' => 40.00,
                'model_mesin' => 'RS51276',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 12,
                'tipe_genset' => '-',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 33.00,
                'kapasitas_daya_kwh' => 26.40,
                'model_mesin' => '-',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 3,
                'tipe_genset' => 'AT 00771',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 66.00,
                'kapasitas_daya_kwh' => 52.80,
                'model_mesin' => 'T 040D',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 9,
                'tipe_genset' => '4045TF120',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 66.00,
                'kapasitas_daya_kwh' => 52.80,
                'model_mesin' => 'J0066K',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 11,
                'tipe_genset' => 'J110K',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 110.00,
                'kapasitas_daya_kwh' => 88.00,
                'model_mesin' => 'SDM139N',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 4,
                'tipe_genset' => '4045TF120',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 66.00,
                'kapasitas_daya_kwh' => 52.80,
                'model_mesin' => 'J66K',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 6,
                'tipe_genset' => 'J33',
                'merek_genset' => 'JOHN DEERE',
                'kapasitas_daya_kva' => 33.00,
                'kapasitas_daya_kwh' => 26.40,
                'model_mesin' => 'AT00630T04D',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 2,
                'tipe_genset' => 'APP 275',
                'merek_genset' => 'PERKINS',
                'kapasitas_daya_kva' => 250.00,
                'kapasitas_daya_kwh' => 200.00,
                'model_mesin' => '1506A-E88TAG',
                'rate_model' => null,
            ],
            [
                'id_transmisi' => 13,
                'tipe_genset' => 'F3L',
                'merek_genset' => 'DEUTZ',
                'kapasitas_daya_kva' => 35.00,
                'kapasitas_daya_kwh' => 28.00,
                'model_mesin' => '-',
                'rate_model' => null,
            ],
        ];

        foreach ($data as $item) {
            MasterGenset::create($item);
        }
    }
}
