<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParametreController;

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

    Route::delete('/deleteUser/{id}', [AuthController::class, 'deleteUser']);

    // Déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);
});

$prefix = "v1";

Route::prefix($prefix)->middleware('auth:api')->group(function () {

    //----------- Insert -------------------//
    Route::post('/api_insert_parametre', [ParametreController::class, 'insertParametre']);
    Route::post('/api_insert_roles', [ParametreController::class, 'insertRoles']);


    //----------- Get -------------------//
    Route::get('/api_get_parametre', [ParametreController::class, 'getAllParametre']);
    Route::get('/api_get_roles', [ParametreController::class, 'getAllroles']);


    //----------- Update -------------------//
    Route::put('/api_update_roles/{id}', [ParametreController::class, 'updateroles']);

    //----------- Delete -------------------//
    Route::delete('/api_delete_roles/{id}', [ParametreController::class, 'deleteroles']);


    //----------- Select -------------------//

});