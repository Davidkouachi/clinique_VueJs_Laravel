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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

use Carbon\Carbon;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use App\Services\MedecinService;
use App\Services\HistoriqueService;

class MedecinController extends Controller
{
    protected $medecinService;
    protected $historiqueService;

    public function __construct(
        MedecinService $medecinService, 
        HistoriqueService $historiqueService
    )
    {
        $this->medecinService = $medecinService;
        $this->historiqueService = $historiqueService;
    }

    // ------------------------------------------------------------

    public function insertUpdatespecialite(Request $request, $id = null)
    {
        Log::info($request->all());
        Log::info($id);

        $rules = [
            'nom' => 'required|string|max:100',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        try {

            $result = $this->medecinService->insertSpecialiteService(
                $validator->validated(),
                $id
            );

            if (!$result['success'] && $result['type'] === 'duplicate') {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg'],
                ], 202);
            }

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                $result['action'],
                'specialites',
                $result['id'],
                $result['action'] === 'insert'
                    ? "Création d'une spécialité"
                    : "Mise à jour d'une spécialité"
            );

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée'
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'info' => true,
                'msg' => $e->getMessage(),
            ], 202);

        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'msg' => 'Erreur serveur',
            ], 500);
        }
    }

    public function getAllspecialite()
    {
        $data = DB::table('specialites')
            // ->leftJoin('users', 'roles.id', '=', 'users.role_id')
            ->select(
                'specialites.id',
                'specialites.nom',
                'specialites.statut',
                'specialites.created_at',
                // DB::raw('COUNT(users.id) as nbreUser')
            )
            // ->groupBy('roles.id', 'roles.nom', 'created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data ?? []
        ], 200);
    }

    public function updatSpecialiteStatut(int $id = null, int $mode = null )
    {

        try {

            $result = $this->medecinService->updatSpecialiteStatutService(
                $id,
                $mode
            );

            // 🧾 Historique (non bloquant)
            $this->historiqueService->log(
                'update',
                'specialites',
                $id,
                $mode === 1
                    ? "Activation de la spécialité"
                    : "Desactivation de la spécialité"
            );

            return response()->json([
                'success' => true,
                'msg' => 'Opération éffectuée'
            ], 200);

        } catch (ModelNotFoundException $e) {

            return response()->json([
                'info' => true,
                'msg' => $e->getMessage(),
            ], 202);

        } catch (\Exception $e) {

            return response()->json([
                'error' => true,
                'msg' => 'Erreur serveur',
            ], 500);
        }
    }
}
