<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('type'); // 'speaki' or 'erpin'
            $table->string('name')->nullable();
            $table->integer('level')->default(1);
            $table->integer('happiness')->default(100);
            $table->json('position')->nullable(); // {x: 0, y: 0}
            $table->json('stats')->nullable(); // Additional stats
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
