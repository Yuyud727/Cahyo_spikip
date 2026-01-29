<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pet_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained()->onDelete('cascade');
            $table->string('interaction_type'); // 'feed', 'play', 'pet', 'struggle'
            $table->json('data')->nullable(); // Additional interaction data
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_interactions');
    }
};
