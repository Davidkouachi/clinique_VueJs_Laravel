<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class MedecinService
{

    public function insertSpecialiteService(array $data, ?int $id = null): array
    {
        return DB::transaction(function () use ($data, $id) {

            $isUpdate = !is_null($id);

            // ---------------- Vérification existence (UPDATE)
            if ($isUpdate) {
                $verf = DB::table('specialites')->where('id', $id)->first();

                if (!$verf) {
                    throw new ModelNotFoundException('Spécialité introuvable');
                }
            }

            // ---------------- Doublons (login / email)
            $duplicate = DB::table('specialites')
                ->where(function ($q) use ($data) {
                    $q->where('nom', $data['nom']);
                })
                ->when($isUpdate, fn ($q) => $q->where('id', '!=', $id))
                ->first();

            if ($duplicate) {
                return [
                    'success' => false,
                    'type' => 'duplicate',
                    'msg' => 'Cette spécialité existe déjà',
                ];
            }

            // ---------------- Données communes
            $payload = [
                'nom' => $data['nom'],
                'updated_at' => now(),
            ];

            // ---------------- UPDATE
            if ($isUpdate) {

                DB::table('specialites')
                    ->where('id', $id)
                    ->update($payload);

                return [
                    'success' => true,
                    'action' => 'update',
                    'id' => $id,
                ];
            }

            // ---------------- INSERT
            $payload['created_at'] = now();

            $newId = DB::table('specialites')->insertGetId($payload);

            return [
                'success' => true,
                'action' => 'insert',
                'id' => $newId,
            ];
        });
    }

    public function updatSpecialiteStatutService(int $id = null, int $mode = null): bool
    {
        return DB::transaction(function () use ($id, $mode) {

            // ✅ Vérification des paramètres
            if ($id === null || $mode === null) {
                throw new ModelNotFoundException('Paramètres invalides');
            }

            // 🔍 Vérification existence
            $specialite = DB::table('specialites')->where('id', $id)->first();

            if (!$specialite) {
                throw new ModelNotFoundException('Spécialité introuvable');
            }

            // ---------------- Données communes
            $payload = [
                'statut' => $mode,
                'updated_at' => now(),
            ];

            // ---------------- UPDATE
            DB::table('specialites')
                ->where('id', $id)
                ->update($payload);

            return true;
        });
    }

}
