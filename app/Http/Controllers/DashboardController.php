<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetConfig;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Get or create default config
        $config = PetConfig::firstOrCreate(
            ['user_id' => null],
            [
                'scale' => 1.0,
                'sound_enabled' => true,
                'pumpkin_enabled' => true,
                'struggle_enabled' => true,
                'settings' => []
            ]
        );

        return view('desktop-pet.index', compact('config'));
    }

    public function setup()
    {
        $config = PetConfig::firstOrCreate(
            ['user_id' => null],
            [
                'scale' => 1.0,
                'sound_enabled' => true,
                'pumpkin_enabled' => true,
                'struggle_enabled' => true,
                'settings' => []
            ]
        );

        return view('desktop-pet.setup', compact('config'));
    }

    public function saveSetup(Request $request)
    {
        $validated = $request->validate([
            'count_speaki' => 'nullable|integer|min:0|max:5',
            'count_erpin' => 'nullable|integer|min:0|max:5',
            'scale' => 'nullable|numeric|min:0.5|max:2',
            'sound_enabled' => 'nullable|boolean',
            'pumpkin_enabled' => 'nullable|boolean',
            'struggle_enabled' => 'nullable|boolean',
        ]);

        // Get or create config
        $config = PetConfig::firstOrCreate(['user_id' => null]);

        // Update config
        $config->update([
            'scale' => $validated['scale'] ?? 1.0,
            'sound_enabled' => $request->has('sound_enabled'),
            'pumpkin_enabled' => $request->has('pumpkin_enabled'),
            'struggle_enabled' => $request->has('struggle_enabled'),
        ]);

        // Remove all existing pets
        Pet::where('user_id', null)->delete();

        // Create Speaki pets
        $countSpeaki = $validated['count_speaki'] ?? 0;
        for ($i = 0; $i < $countSpeaki; $i++) {
            Pet::create([
                'user_id' => null,
                'type' => 'speaki',
                'position' => [
                    'x' => 100 + ($i * 150),
                    'y' => 100
                ],
                'level' => 1,
                'happiness' => 100,
                'is_active' => true
            ]);
        }

        // Create Erpin pets
        $countErpin = $validated['count_erpin'] ?? 0;
        for ($i = 0; $i < $countErpin; $i++) {
            Pet::create([
                'user_id' => null,
                'type' => 'erpin',
                'position' => [
                    'x' => 100 + ($i * 150),
                    'y' => 300
                ],
                'level' => 1,
                'happiness' => 100,
                'is_active' => true
            ]);
        }

        return redirect()->route('desktop-pet.index')
            ->with('success', 'Setup saved successfully!');
    }
}
