<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class UserService
{

    public function insertUserService(array $data, ?int $id = null): array
    {
        return DB::transaction(function () use ($data, $id) {

            $isUpdate = !is_null($id);

            // ---------------- Vérification existence (UPDATE)
            if ($isUpdate) {
                $user = DB::table('users')->where('id', $id)->first();

                if (!$user) {
                    throw new ModelNotFoundException('Utilisateur introuvable');
                }
            }

            // ---------------- Doublons (login / email)
            $duplicate = DB::table('users')
                ->where(function ($q) use ($data) {
                    $q->where('login', $data['login']);
                      ->orWhere('email', $data['email']);
                })
                ->when($isUpdate, fn ($q) => $q->where('id', '!=', $id))
                ->first();

            if ($duplicate) {
                return [
                    'success' => false,
                    'type' => 'duplicate',
                    'msg' => 'Login ou email déjà utilisé',
                ];
            }

            // ---------------- Données communes
            $payload = [
                'name' => $data['name'],
                'login' => $data['login'],
                'email' => $data['email'],
                'role_id' => $data['role_id'],
                'updated_at' => now(),
            ];

            // ---------------- Password
            if (!empty($data['password'])) {
                $payload['password'] = bcrypt($data['password']);
            }

            // ---------------- UPDATE
            if ($isUpdate) {

                DB::table('users')
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

            $newId = DB::table('users')->insertGetId($payload);

            return [
                'success' => true,
                'action' => 'insert',
                'id' => $newId,
            ];
        });
    }

    public function disableUsersService(array $ids): array
    {
        return DB::transaction(function () use ($ids) {

            // 🔐 sécurité : ne jamais se désactiver soi-même
            $ids = array_values(array_diff($ids, [auth()->id()]));

            if (!count($ids)) {
                return [];
            }

            // utilisateurs actifs concernés
            $users = DB::table('users')
                ->whereIn('id', $ids)
                ->where('statut', true)
                ->pluck('id')
                ->toArray();

            if (!count($users)) {
                return [];
            }

            DB::table('users')
                ->whereIn('id', $users)
                ->update([
                    'statut' => false,
                    'updated_at' => now(),
                ]);

            return $users; // 👈 ids réellement désactivés
        });
    }


}
