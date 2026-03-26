<?php

namespace App\Services;

use App\Models\Parametre;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class PatientService
{

    public function insertUpdatePatientService(
        array $data,
        ?string $uid = null,
        ?string $uid_new = null,
        ?string $numdossier = null
    ): array
    {
        DB::beginTransaction();

        try {
            $isUpdate = !is_null($uid);

            // 🔎 Vérification doublon patient
            $duplicate = DB::table('patients')
                ->where(function ($q) use ($data) {
                    $q->where('telephone1', $data['telephone1']);
                    if (!empty($data['email'])) {
                        $q->orWhere('email', $data['email']);
                    }
                })
                ->when($isUpdate, fn ($q) => $q->where('uid', '!=', $uid))
                ->first();

            if ($duplicate) {
                DB::rollBack();
                return [
                    'success' => false,
                    'msg' => 'Téléphone ou email déjà utilisé'
                ];
            }

            // 🧾 Payload patient
            $patientPayload = [
                'nom'               => $data['nom'],
                'prenoms'           => $data['prenoms'] ?? null,
                'sexe'              => $data['sexe'],
                'datenais'          => $data['datenais'] ?? null,
                'lieunais'          => $data['lieunais'] ?? null,
                'telephone1'        => $data['telephone1'],
                'telephone2'        => $data['telephone2'] ?? null,
                'email'             => $data['email'] ?? null,
                'adresse'           => $data['adresse'] ?? null,
                'groupe_sanguin'    => $data['groupe_sanguin'] ?? null,
                'updated_at'        => now(),
            ];

            // INSERT / UPDATE patient
            if ($isUpdate) {
                $patient = DB::table('patients')->where('uid', $uid)->first();
                if (!$patient) throw new ModelNotFoundException('Patient introuvable');

                DB::table('patients')->where('uid', $uid)->update($patientPayload);
                $patientId = $patient->id;

            } else {
                $patientPayload['uid'] = $uid_new;
                $patientPayload['numdossier'] = $numdossier;
                $patientPayload['created_at'] = now();

                $patientId = DB::table('patients')->insertGetId($patientPayload);
            }

            // 🧬 ALLERGIES (tables pivot)
            if (!empty($data['allergies'])) {
                DB::table('patient_allergies')->where('patient_id', $patientId)->delete();

                foreach ($data['allergies'] as $allergieId) {
                    DB::table('patient_allergies')->insert([
                        'patient_id' => $patientId,
                        'allergie_id' => $allergieId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 🧬 ANTECEDENTS (tables pivot)
            if (!empty($data['antecedents'])) {
                DB::table('patient_antecedents')->where('patient_id', $patientId)->delete();

                foreach ($data['antecedents'] as $antecedentId) {
                    DB::table('patient_antecedents')->insert([
                        'patient_id' => $patientId,
                        'antecedent_id' => $antecedentId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // 🛡️ ASSURANCE
            if (!empty($data['assurance_id'])) {
                DB::table('patients_assurances')->where('patient_id', $patientId)->delete();

                DB::table('patients_assurances')->insert([
                    'patient_id' => $patientId,
                    'assurance_id' => $data['assurance_id'],
                    'matricule' => $data['numero_assure'] ?? null,
                    'taux' => $data['taux'] ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 🚑 URGENCES
            if (!empty($data['urgences'])) {
                DB::table('patients_urgences')->where('patient_id', $patientId)->delete();

                foreach ($data['urgences'] as $urgence) {
                    DB::table('patients_urgences')->insert([
                        'patient_id' => $patientId,
                        'nom' => $urgence['nom'],
                        'lien' => $urgence['lien'] ?? null,
                        'telephone1' => $urgence['telephone1'],
                        'telephone2' => $urgence['telephone2'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();

            return [
                'success' => true,
                'action' => $isUpdate ? 'update' : 'insert',
                'id' => $patientId
            ];

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            throw $e;
        }
    }

}
