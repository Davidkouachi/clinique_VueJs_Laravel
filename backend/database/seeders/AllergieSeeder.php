<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllergieSeeder extends Seeder
{
    public function run(): void
    {
        $allergies = [
            'Arachide',
            'Pollen',
            'Poussière',
            'Lactose',
            'Gluten',
            'Pénicilline',
            'Aspirine',
            'Fruits de mer',
            'Poils d’animaux',
            'Médicaments (général)',
            'Latex',
            'Moisissures'
        ];

        foreach ($allergies as $nom) {
            DB::table('allergies')->updateOrInsert(
                ['nom' => $nom],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}