<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AntecedentSeeder extends Seeder
{
    public function run(): void
    {
        $antecedents = [
            'Hypertension',
            'Diabète',
            'Asthme',
            'Maladie cardiaque',
            'AVC',
            'Cancer',
            'Insuffisance rénale',
            'Ulcère gastrique',
            'Épilepsie',
            'Tuberculose',
            'VIH/SIDA',
            'Chirurgie antérieure'
        ];

        foreach ($antecedents as $nom) {
            DB::table('antecedents')->updateOrInsert(
                ['nom' => $nom],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}