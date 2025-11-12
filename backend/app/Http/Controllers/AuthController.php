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

    // public function traitement_login(Request $request)
    // {
    //     $login = $request->input('login');
    //     $password = $request->input('password');
    //     $remember = $request->boolean('remember_me');

    //     // Récupération de l'utilisateur par login exact (sensible à la casse)
    //     // $user = DB::table('users')->whereRaw('BINARY login = ?', [$login])->first(); // sensible a la casse MySql
    //     // $user = DB::table('users')->whereRaw('login ILIKE ?', [$login])->first(); // insensible a la casse postgresql

    //     $driver = DB::getDriverName();

    //     if ($driver === 'pgsql') {
    //         $user = DB::table('users')->where('login', $login)->first(); // sensible à la casse
    //     } else {
    //         $user = DB::table('users')->whereRaw('BINARY login = ?', [$login])->first(); // MySQL
    //     }

    //     if (!$user) {
    //         return response()->json([
    //             'warn' => true,
    //             'message' => 'Login ou mot de passe incorrect'
    //         ], 201);
    //     }

    //     // Vérif du mot de passe
    //     if (!Hash::check($password, $user->password)) {
    //         return response()->json([
    //             'warn' => true,
    //             'message' => 'Login ou mot de passe incorrect'
    //         ], 201);
    //     }

    //     // Vérification des sessions existantes
    //     $existingSessions = DB::table('sessions')->where('user_id', $user->id)->get();

    //     if ($existingSessions->count() > 0) {
    //         $lastSession = $existingSessions->sortByDesc('last_activity')->first();
    //         $lastActivity = $lastSession->last_activity ?? null;

    //         if ($lastActivity) {
    //             $now = time();
    //             $diff = $now - $lastActivity;

    //             if ($diff <= 600) { // 10 minutes
    //                 return response()->json([
    //                     'info' => true,
    //                     'message' => 'Ce compte est déjà connecté sur un autre appareil.'
    //                 ], 201);
    //             }
    //         }

    //         // Suppression sessions expirées
    //         DB::table('sessions')->where('user_id', $user->id)->delete();
    //     }

    //     // Connexion Laravel
    //     Auth::loginUsingId($user->id, $remember);

    //     // Session lifetime depuis config/session.php
    //     $sessionLifetimeMinutes = config('session.lifetime');
    //     $sessionExpireTimestamp = now()->addMinutes($sessionLifetimeMinutes)->timestamp * 1000; // en ms

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Connexion réussie',
    //         'user'    => Auth::user(),
    //         'session_lifetime' => $sessionLifetimeMinutes,
    //         'session_expire'   => $sessionExpireTimestamp
    //     ], 200);
    // }

    public function traitement_login(Request $request)
    {
        $credentials = $request->only('login', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['warn' => true, 'message' => 'Login ou mot de passe incorrect'], 201);
        }

        $user = Auth::guard('api')->user();

        // Crée un refresh token
        $refreshToken = base64_encode(Str::random(64));

        DB::table('refresh_tokens')->insert([
            'user_id' => $user->id,
            'token' => $refreshToken,
            'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles,
            ],
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60, // secondes
        ]);
    }

    // public function user_list(Request $request)
    // {
    //     $data = DB::table('users')->select('id', 'name', 'email', 'login')->get();

    //     return response()->json([
    //         'success' => $data->isNotEmpty(),
    //         'data' => $data,
    //     ], $data->isNotEmpty() ? 200 : 204);
    // }

public function user_list(Request $request)
{
    // Récupérer les utilisateurs existants
    $data = DB::table('users')->select('id', 'name', 'email', 'login')->get();

    // Si moins de 100 utilisateurs, compléter avec des fake
    $count = $data->count();
    if ($count < 100) {
        for ($i = $count + 1; $i <= 100; $i++) {
            $data->push((object)[
                'id' => $i,
                'name' => "User $i",
                'email' => "user$i@example.com",
                'login' => "user$i",
            ]);
        }
    }

    return response()->json([
        'success' => true,
        'data' => $data,
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
        return response()->json(Auth::guard('api')->user());
    }

    public function refreshToken(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        $tokenData = DB::table('refresh_tokens')->where('token', $refreshToken)->first();

        if (!$tokenData || $tokenData->expires_at < now()) {
            return response()->json(['error' => 'Refresh token expiré ou invalide'], 401);
        }

        $userData = DB::table('users')->where('id', $tokenData->user_id)->first();
        if (!$userData) {
            return response()->json(['error' => 'Utilisateur introuvable'], 401);
        }

        // Crée un modèle User et définit manuellement l'id
        $user = new User();
        $user->forceFill((array) $userData); // forceFill remplit tous les champs mass assignable
        $user->setAttribute('id', $userData->id); // Assure que l'id est défini
        $user->exists = true; // Indique à Eloquent que l'utilisateur existe dans la base

        // Génère un nouveau access token JWT
        $newAccessToken = Auth::guard('api')->login($user);

        // Rotation du refresh token
        $newRefresh = base64_encode(Str::random(64));
        DB::table('refresh_tokens')->where('token', $refreshToken)->update([
            'token' => $newRefresh,
            'expires_at' => now()->addMinutes((int) config('jwt.refresh_ttl')),
        ]);

        return response()->json([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefresh,
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60
        ]);
    }

    public function checkAuth()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'authenticated' => false,
                    'message' => 'Token invalide ou expiré'
                ], 401);
            }

            // Récupérer le token actuel
            $token = JWTAuth::getToken();
            $payload = JWTAuth::getPayload($token);

            // Calcul du temps restant réel
            $exp = $payload->get('exp');           // timestamp d'expiration
            $tempsRestant = $exp - time();         // secondes restantes

            // Rafraîchir le token si < 5 min
            if ($tempsRestant < 300) {
                $newToken = JWTAuth::refresh($token);  // nouveau token
                $tokenToReturn = $newToken;
                $tempsRestant = auth('api')->factory()->getTTL() * 60; // TTL complet
            } else {
                $tokenToReturn = $token; // garder le token actuel
            }

            return response()->json([
                'authenticated' => true,
                'token' => $tokenToReturn,
                'temps_restant' => $tempsRestant,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles,
                ]
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Token expiré'
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'authenticated' => false,
                'message' => 'Erreur : ' . $e->getMessage()
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $refresh = $request->input('refresh_token');
        if ($refresh) {
            DB::table('refresh_tokens')->where('token', $refresh)->delete();
        }

        Auth::guard('api')->logout();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

}
