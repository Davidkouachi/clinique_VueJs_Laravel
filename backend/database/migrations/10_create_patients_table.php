<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->string('numdossier')->unique();

            $table->string('nom');
            $table->string('prenoms')->nullable();

            $table->string('sexe', 10);
            $table->date('datenais')->nullable();
            $table->string('lieunais')->nullable();

            $table->string('telephone1');
            $table->string('telephone2')->nullable();
            $table->string('email')->nullable();

            $table->string('adresse')->nullable();
            $table->string('photo')->nullable();

            $table->boolean('statut')->default(true);

            $table->timestamps();
        });

        Schema::create('patients_info', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->string('groupe_sanguin')->nullable();

            $table->json('allergies')->nullable();     // 🔥 JSON
            $table->json('antecedents')->nullable();   // 🔥 JSON

            $table->timestamps();
        });

        Schema::create('patients_assurances', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->foreignId('assurance_id')
                ->nullable()
                ->constrained('assurances')
                ->nullOnDelete();

            $table->string('matricule')->nullable();
            $table->decimal('taux', 5, 2)->default(0); // 🔥 80.00%

            $table->boolean('statut')->default(true);

            $table->timestamps();
        });

        Schema::create('patients_urgences', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->string('nom');
            $table->string('lien')->nullable();

            $table->string('telephone1');
            $table->string('telephone2')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
