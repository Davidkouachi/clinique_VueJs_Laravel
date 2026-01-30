<?php

namespace App\Http\Controllers;

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

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use App\Services\ParametreService;

class ParametreController extends Controller
{
    protected $parametreService;

    public function __construct(ParametreService $parametreService)
    {
        $this->parametreService = $parametreService;
    }

    // ------------------------------------------------------------

    public function update(Request $request)
    {   
        Log::info($request->all());
        // 1️⃣ Validation
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'type_structure' => 'required|string',
            'numero_agrement' => 'nullable|string|max:255',
            'sigle' => 'nullable|string|max:255',

            'pays' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'commune' => 'nullable|string|max:255',
            'adresse' => 'nullable|string|max:255',

            'telephone1' => 'required|string|max:20',
            'telephone2' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',

            'heure_ouverture' => 'nullable|date_format:H:i:s',
            'heure_fermeture' => 'nullable|date_format:H:i:s|after:heure_ouverture',

            'devise' => 'required|string|max:10',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:1024',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201); // 422 = validation error
        }

        $validated = $validator->validated();

        try {
            // 2️⃣ Enregistrement via le service
            $parametre = $this->parametreService->update(
                $validated,
                $request->file('logo')
            );

            $getAll = DB::table('parametres')->first();

            return response()->json([
                'success' => true,
                'msg' => 'Paramètres enregistrés avec succès',
                'data' => $getAll
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'error' => true,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

    public function getAll()
    {
        $parametre = DB::table('parametres')->first();

        if ($parametre) {
            return response()->json([
                'success' => true,
                'data' => $parametre
            ], 200);
        }

        return response()->json([
            'success' => false,
            'msg' => 'Aucun paramètre trouvé'
        ], 201);
    }

}
