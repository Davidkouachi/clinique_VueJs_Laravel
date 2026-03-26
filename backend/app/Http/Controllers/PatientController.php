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

use App\Services\PatientService;
use App\Services\HistoriqueService;
use App\Services\CodeService;

class PatientController extends Controller
{
    protected $patientService;
    protected $historiqueService;
    protected $codeService;

    public function __construct(
        PatientService $patientService, 
        HistoriqueService $historiqueService,
        CodeService $codeService,
    )
    {
        $this->patientService = $patientService;
        $this->historiqueService = $historiqueService;
        $this->codeService = $codeService;
    }

    // ------------------------------------------------------------

    public function insertUpdatePatient(Request $request, $uid = null)
    {

        $rules = [
            'nom'          => 'required|string|max:100',
            'prenoms'      => 'nullable|string|max:150',
            'sexe'         => 'required|in:Masculin,Féminin',
            'datenais'     => 'nullable|date',
            'lieunais'     => 'nullable|string|max:150',

            'telephone1'   => 'required|string',
            'telephone2'   => 'nullable|string',
            'email'        => 'nullable|email',

            'adresse'      => 'nullable|string',

            'groupe_sanguin' => 'nullable|string|max:5',

            // Assurance
            'assurance_id' => 'nullable|exists:assurances,id',
            'numero_assure'=> 'nullable|string|max:100',
            'taux'         => 'nullable|numeric|min:0|max:100',

            // Info médicale
            'allergies'   => 'nullable|array',
            'allergies.*' => 'exists:allergies,id',

            'antecedents'   => 'nullable|array',
            'antecedents.*' => 'exists:antecedents,id',

            // Urgences
            'urgences' => 'required|array|min:1',
            'urgences.*.nom' => 'required|string|max:150',
            'urgences.*.telephone1' => 'required|string|max:20',
            'urgences.*.telephone2' => 'nullable|string|max:20',
            'urgences.*.lien' => 'nullable|string|max:100',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'info' => true,
                'msg' => 'Formulaire non valide',
                'errors' => $validator->errors()
            ], 201);
        }

        $uid_new = null;
        $numdossier = null;

        if (!$uid) {
            $uid_new = $this->codeService->generateUid(
                table: 'patients'
            );

            $numdossier = $this->codeService->generateCode(
                table: 'patients',
                column: 'numdossier',
                prefix: 'PAT'
            );
        }

        try {
            $result = $this->patientService->insertUpdatePatientService(
                $validator->validated(),
                $uid,
                $uid_new,
                $numdossier
            );

            if (!$result['success']) {
                return response()->json([
                    'info' => true,
                    'msg' => $result['msg']
                ], 202);
            }

            return response()->json([
                'success' => true,
                'msg' => $result['action'] === 'insert'
                    ? 'Patient créé avec succès'
                    : 'Patient mis à jour avec succès'
            ], 200);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => true,
                'msg' => $e->getMessage()
            ], 500);
        }
    }

}
