<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecialiteSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('specialites')->insert([
            ['nom' => 'Médecine générale', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Cardiologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Dermatologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Gynécologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Pédiatrie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Neurologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Psychiatrie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Ophtalmologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'ORL (Oto-rhino-laryngologie)', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Urologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Néphrologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Endocrinologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Diabétologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Pneumologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Rhumatologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Oncologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Hématologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Allergologie', 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Immunologie', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('medecintitres')->insert([
            [
                'nom' => 'Docteur', 
                'signe' => 'Dr', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => 'Médécin', 
                'signe' => 'Med', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
            [
                'nom' => 'Professeur', 
                'signe' => 'Prof', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
        ]);
    }
}