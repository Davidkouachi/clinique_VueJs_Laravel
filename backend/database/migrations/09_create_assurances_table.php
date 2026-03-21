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
        Schema::create('assurances', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique()->index();
            $table->string('code')->unique()->index();
            $table->string('nom')->unique()->index();
            $table->string('telephone1')->unique()->index();
            $table->string('telephone2')->nullable()->index();
            $table->string('email')->nullable();
            $table->integer('type')->index();
            $table->string('adresse');
            $table->boolean('statut')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assurances');
    }
};
