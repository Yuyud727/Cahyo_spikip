<?php

namespace Database\Seeders;

use App\Models\Pet;
use App\Models\PetConfig;
use Illuminate\Database\Seeder;

class PetSeeder extends Seeder
{
    public function run(): void
    {
        // Create default config
        PetConfig::firstOrCreate(
            ['user_id' => null],
            [
                'scale' => 1.0,
                'sound_enabled' => true,
                'pumpkin_enabled' => true,
                'struggle_enabled' => true,
                'settings' => []
            ]
        );

        // Create sample pets
        Pet::create([
            'user_id' => null,
            'type' => 'speaki',
            'name' => 'Demo Speaki',
            'position' => ['x' => 200, 'y' => 100],
            'level' => 1,
            'happiness' => 100,
            'is_active' => true
        ]);

        Pet::create([
            'user_id' => null,
            'type' => 'erpin',
            'name' => 'Demo Erpin',
            'position' => ['x' => 400, 'y' => 100],
            'level' => 1,
            'happiness' => 100,
            'is_active' => true
        ]);
    }
}
