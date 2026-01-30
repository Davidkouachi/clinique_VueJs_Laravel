<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ParametreService
{
    /**
     * Créer ou mettre à jour les paramètres de la clinique
     */
    public function update(array $data, ?UploadedFile $logo = null): array
    {
        return DB::transaction(function () use ($data, $logo) {

            $parametre = DB::table('parametres')->first();

            if ($logo) {
                if ($parametre && $parametre->logo) {
                    Storage::disk('public')->delete($parametre->logo);
                }

                $extension = $logo->getClientOriginalExtension();
                $filename = time() . '_' . md5($logo->getClientOriginalName()) . '.' . $extension;

                $data['logo'] = $logo->storeAs('images/logo', $filename, 'public');
            }

            // Mise à jour ou création
            if ($parametre) {


                DB::table('parametres')
                    ->where('id', $parametre->id)
                    ->update(array_merge($data, ['updated_at' => now()]));
                $id = $parametre->id;

            } else {

                $id = DB::table('parametres')->insertGetId(array_merge($data, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }

            return (array) DB::table('parametres')->where('id', $id)->first();
        });
    }

}
