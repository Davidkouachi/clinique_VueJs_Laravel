<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Routes publiques
Route::post('/login', [AuthController::class, 'traitement_login']);

// Routes protégées par JWT
Route::middleware('auth:api')->group(function () {
    Route::post('/refresh', [AuthController::class, 'refreshToken']);

    Route::post('/register', [AuthController::class, 'traitement_registre']);

    // Route pour vérifier le token
    Route::get('/check-auth', [AuthController::class, 'checkAuth']);

    // Récupérer l'utilisateur connecté
    Route::get('/me', [AuthController::class, 'me']);

    // Liste des utilisateurs (exemple)
    Route::get('/users/list', [AuthController::class, 'user_list']);
    Route::get('/users/count', [AuthController::class, 'user_count']);

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
});
