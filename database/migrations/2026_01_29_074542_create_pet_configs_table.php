<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pet_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->float('scale')->default(1.0);
            $table->boolean('sound_enabled')->default(true);
            $table->boolean('pumpkin_enabled')->default(true);
            $table->boolean('struggle_enabled')->default(true);
            $table->json('settings')->nullable(); // Additional settings
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_configs');
    }
};
