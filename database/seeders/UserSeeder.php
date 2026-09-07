<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Collection;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $ketuaTimRole = Role::firstOrCreate(['name' => 'ketua tim']);
        $teknisiRole = Role::firstOrCreate(['name' => 'teknisi']);
        $operatorRole = Role::firstOrCreate(['name' => 'operator']);
        $koordinatorRole = Role::firstOrCreate(['name' => 'koordinator']);
        $sdmRole = Role::firstOrCreate(['name' => 'sdm']);

        // Buat user
        $user = User::create([
            'name' => 'Admin SIMANTAR',
            'phone' => '6289514800903',
            'email' => 'admin@simantar.com',
            'password' => Hash::make('password'),
        ]);

        // Assign role ke user
        $user->assignRole($adminRole);

        // Baca file CSV
        $path = database_path('seeders/users.csv');
        if (!file_exists($path)) {
            $this->command->error("File CSV tidak ditemukan di: $path");
            return;
        }

        $handle = fopen($path, 'r');
        $header = fgetcsv($handle); // Baca baris header pertama

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);

            // Buat role jika belum ada
            $role = Role::firstOrCreate(['name' => $data['Role']]);

            // Buat user baru
            $user = User::firstOrCreate(
                ['email' => $data['NIP'].'@simantar.com'],
                [
                    'name' => $data['NAMA'],
                    'phone' => $data['TELEPON'],
                    'nip' => $data['NIP'],
                    'password' => Hash::make($data['NIP']),
                ]
            );

            // Assign role
            $user->assignRole($role);
        }

        fclose($handle);

        // // Buat permissions untuk user management
        // $permissions = [
        //     'create user',
        //     'read user',
        //     'update user',
        //     'delete user',
        // ];

        // foreach ($permissions as $perm) {
        //     Permission::firstOrCreate(['name' => $perm]);
        // }

        // $adminRole->givePermissionTo($permissions);

        // // Buat user ketua tim
        // for ($i = 1; $i <= 1; $i++) {
        //     $user = User::create([
        //         'name' => 'Ketua Tim SIMANTAR ' . $i,
        //         'phone' => '6289514800903',
        //         'email' => 'ketuatim' . $i . '@simantar.com',
        //         'password' => Hash::make('password'),
        //     ]);
        //     // Assign role ke user
        //     $user->assignRole($ketuaTimRole);
        // }

        // // Buat user teknisi
        // for ($i = 1; $i <= 5; $i++) {
        //     $user = User::create([
        //         'name' => 'Teknisi SIMANTAR ' . $i,
        //         'phone' => '6289514800903',
        //         'email' => 'teknisi' . $i . '@simantar.com',
        //         'password' => Hash::make('password'),
        //     ]);
        //     // Assign role ke user
        //     $user->assignRole($teknisiRole);
        // }

        // // Buat user operator
        // for ($i = 1; $i <= 100; $i++) {
        //     $user = User::create([
        //         'name' => 'Operator SIMANTAR ' . $i,
        //         'phone' => '6289514800903',
        //         'email' => 'operator' . $i . '@simantar.com',
        //         'password' => Hash::make('password'),
        //     ]);
        //     // Assign role ke user
        //     $user->assignRole($operatorRole);
        // }
    }
}