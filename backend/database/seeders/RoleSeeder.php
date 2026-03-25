<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insertGetId([
            'nom' => 'administrateur',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insertGetId([
            'name' => 'Administrateur',
            'login' => 'admin',
            'email' => 'admin@gmail.com',
            'role_id' => 1,
            'password' => password_hash('password', PASSWORD_BCRYPT),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('roles')->insert([
            ['nom' => 'administrateur', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'medecin', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'patient', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}