<?php

namespace App\Http\Controllers;

use App\Models\User;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\UploadedFile;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class AuthController extends Controller
{
    // jwt-auth secret [bjLVyolTGi4U5DO1wzGpqBZEwrUxFQnk2FzLgZ2uzzgpLGUyaGsFXdDsMATAc84r]
    // Backend (Laravel)
    // On garde les codes HTTP corrects :

    //     200 → connexion réussie

    //     401 → identifiants invalides

    //     403 → compte inactif ou refusé

    //     500 → erreur serveur

    public function traitement_registre(Request $request)
    {
        $login = $request->input('login');
        $password = $request->input('password');
        $name = $request->input('name');
        $email = $request->input('email');

        $verf = DB::table('users')
                    ->where('login', $login)
                    ->exists();

        if ($verf) {
            return response()->json([
                'info' => true,
                'message' => 'Veuillez changer votre Login.'
            ], 201);
        }

        DB::beginTransaction();

        try {

            // 3. Insertion en base
            $userId = DB::table('users')->insertGetId([
                'name' => $name,
                'login' => $login,
                'email' => $email,
                'password' => password_hash($password, PASSWORD_BCRYPT),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if (!$userId) {
                throw new Exception('Données du formulaire incomplètes');
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Utilisateur enregistré avec succès'], 200);

        } catch (Exception $e) {

            DB::rollback();
            return response()->json(['error' => true, 'message' => $e->getMessage()], 409);
        }
    }

    public function traitement_login(Request $request)
    {
        $credentials = $request->only('login', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'warn' => true, 
                'message' => 'Login ou mot de passe incorrect'
            ], 201);
        }

        $user = Auth::guard('api')->user();

        $plainRefreshToken = Str::random(128);
        $refreshToken = hash('sha256', $plainRefreshToken);

        // DB::table('refresh_tokens')->updateOrInsert(
        // [
        //     'user_id'=>$user->id,
        //     'device_id'=>$request->device_id
        // ],
        // [
        //     'token'=> $refreshToken,
        //     'expires_at'=> now()->addMinutes((int) config('jwt.refresh_ttl')),
        //     'updated_at' => now(),
        //     'created_at' => now()
        // ]);

        DB::table('refresh_tokens')->updateOrInsert(
            [
                'user_id' => $user->id,
                'device_id' => $request->device_id
            ],
            [
                'token' => $refreshToken,
                'expires_at' => now()->addDays(7),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'updated_at' => now()
            ]
        );

        $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $roles->nom,
                'login' => $user->login,
            ],
            'access_token'  => $token,
            'refresh_token' => $plainRefreshToken,
            'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60,
        ]);
    }

    public function user_list(Request $request)
    {
        // Récupérer les utilisateurs existants
        $data = DB::table('users')
            ->leftJoin('roles', 'users.role_id', '=', 'roles.id')
            ->select(
                'users.id', 
                'users.name', 
                'users.email', 
                'users.login', 
                'roles.nom as roles', 
                'users.created_at'
            )->get();

        $maxId = $data->max('id');  // Le plus grand ID réel
        $nextId = $maxId + 1;

        // Ajouter des fake users
        for ($i = $nextId; $i < $nextId + 100; $i++) {
            $data->push((object)[
                'id' => $i,
                'name' => "User $i",
                'roles' => "admin",
                'email' => "user$i@example.com",
                'login' => "user$i",
                'created_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function deleteUser($id)
    {
        $user = DB::table('users')->where('id', $id)->exists();

        if (!$user) {
            return response()->json([
                'info' => true,
                'message' => 'Utilisateur introuvable'
            ], 201);
        }

        $delete = DB::table('users')->where('id', $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès'
        ], 200);
    }

    public function user_count(Request $request)
    {
        $count = DB::table('users')->count();

        return response()->json([
            'success' => $count > 0,
            'count' => $count,
        ], 200);
    }

    public function me()
    {

        $user = Auth::guard('api')->user();

        $roles = DB::table('roles')->where('id', $user->role_id)->select('nom')->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $roles->nom ?? null,
            'login' => $user->login,
        ]);
    }

    // public function refreshToken(Request $request)
    // {
    //     $plainRefreshToken = $request->input('refresh_token'); // token reçu côté client
    //     $deviceId = $request->input('device_id');
    //     $userId = $request->input('user_id');

    //     Log::info($plainRefreshToken);
    //     Log::info($deviceId);
    //     Log::info($userId);

    //     // Vérifie le token hashé en DB
    //     $tokenData = DB::table('refresh_tokens')
    //         ->where('device_id', $deviceId)
    //         ->where('user_id', $userId)
    //         ->first();

    //     Log::info([
    //         'token_db' => $tokenData->token ?? null,
    //         'token_client_hash' => hash('sha256', $plainRefreshToken)
    //     ]);

    //     if (!$tokenData || !hash_equals($tokenData->token, hash('sha256', $plainRefreshToken))) {
    //         Log::info('Refresh token invalide');
    //         return response()->json(['error' => 'Refresh token invalide'], 401);
    //     }

    //     if ($tokenData->expires_at < now()) {
    //         Log::info('Refresh token expiré');
    //         return response()->json(['error' => 'Refresh token expiré'], 401);
    //     }

    //     $user = User::find($userId);

    //     if (!$user) {
    //         Log::info('Utilisateur introuvable');
    //         return response()->json(['error' => 'Utilisateur introuvable'], 401);
    //     }

    //     $newAccessToken = Auth::guard('api')->login($user);

    //     // rotation : nouveau refresh token brut + hashé
    //     $newPlainRefresh = Str::random(128);
    //     $newHashedRefresh = hash('sha256', $newPlainRefresh);

    //     DB::table('refresh_tokens')
    //         ->where('device_id', $deviceId)
    //         ->where('user_id', $userId)
    //         ->update([
    //             'token' => $newHashedRefresh,
    //             'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
    //             'updated_at' => now()
    //         ]);

    //     Log::info('-------------------------------');

    //     return response()->json([
    //         'access_token'  => $newAccessToken,
    //         'refresh_token' => $newPlainRefresh, // on renvoie le token brut côté client
    //         'expires_in'    => Auth::guard('api')->factory()->getTTL() * 60
    //     ]);
    // }

    public function refreshToken(Request $request)
    {
        $plainToken = $request->refresh_token;
        $deviceId = $request->device_id;

        Log::info('REFRESH REQUEST', [
            'device_id' => $deviceId,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent()
        ]);

        if (!$plainToken || !$deviceId) {

            Log::warning('REFRESH ERROR: Missing parameters', [
                'refresh_token' => $plainToken ? 'present' : 'missing',
                'device_id' => $deviceId
            ]);

            return response()->json([
                'error' => 'Missing refresh_token or device_id'
            ], 400);
        }

        $hashed = hash('sha256', $plainToken);

        $tokenData = DB::table('refresh_tokens')
            ->where('device_id', $deviceId)
            ->first();

        if (!$tokenData) {

            Log::warning('REFRESH ERROR: Token not found for device', [
                'device_id' => $deviceId
            ]);

            return response()->json([
                'error' => 'Session not found'
            ], 401);
        }

        if (!hash_equals($tokenData->token, $hashed)) {

            Log::warning('REFRESH ERROR: Invalid refresh token', [
                'device_id' => $deviceId,
                'user_id' => $tokenData->user_id,
                'token_db' => $tokenData->token,
                'token_received_hash' => $hashed
            ]);

            // tentative suspecte → suppression session
            DB::table('refresh_tokens')
                ->where('device_id', $deviceId)
                ->delete();

            return response()->json([
                'error' => 'Session compromised'
            ], 401);
        }

        if ($tokenData->expires_at < now()) {

            Log::info('REFRESH ERROR: Token expired', [
                'device_id' => $deviceId,
                'user_id' => $tokenData->user_id,
                'expired_at' => $tokenData->expires_at
            ]);

            return response()->json([
                'error' => 'Refresh token expired'
            ], 401);
        }

        $user = User::find($tokenData->user_id);

        if (!$user) {

            Log::error('REFRESH ERROR: User not found', [
                'user_id' => $tokenData->user_id
            ]);

            return response()->json([
                'error' => 'User not found'
            ], 401);
        }

        Log::info('REFRESH SUCCESS: Generating new access token', [
            'user_id' => $user->id,
            'device_id' => $deviceId
        ]);

        $accessToken = auth('api')->login($user);

        // rotation refresh token
        $newPlain = Str::random(128);
        $newHash = hash('sha256', $newPlain);

        DB::table('refresh_tokens')
            ->where('device_id', $deviceId)
            ->update([
                'token' => $newHash,
                'expires_at' => now()->addDays(7),
                'updated_at' => now()
            ]);

        Log::info('REFRESH SUCCESS: Token rotated', [
            'user_id' => $user->id,
            'device_id' => $deviceId
        ]);

        Log::info('------------------------------------------');

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $newPlain,
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    // public function logout(Request $request) // 1 user = 1 refresh token
    // {
    //     DB::table('refresh_tokens')
    //         ->where('device_id', $request->device_id)
    //         ->where('user_id', $request->user_id)
    //         ->where('token', hash('sha256', $request->refresh_token))
    //         ->delete();

    //     Auth::guard('api')->logout();

    //     // DB::table('refresh_tokens')
    //     //     ->where('expires_at','<',now())
    //     //     ->delete();

    //     return response()->json([
    //         'message' => 'Déconnexion réussie'
    //     ]);
    // }

    public function logout(Request $request)
    {
        $deviceId = $request->device_id;

        DB::table('refresh_tokens')
            ->where('device_id', $deviceId)
            ->delete();

        Auth::guard('api')->logout();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    // 5️⃣ Logout tous les appareils
    public function logoutAll(Request $request)
    {
        $user = auth()->user();

        DB::table('refresh_tokens')
            ->where('user_id', $user->id)
            ->delete();

        return response()->json([
            'message' => 'Déconnexion de tous les appareils'
        ]);
    }

    // 6️⃣ Liste des appareils connectés (très pro)
    public function sessions()
    {
        $user = auth()->user();

        $sessions = DB::table('refresh_tokens')
            ->where('user_id', $user->id)
            ->get();

        return response()->json($sessions);
    }


}
