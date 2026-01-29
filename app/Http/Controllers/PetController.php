<?php

namespace App\Http\Controllers;

use App\Models\Pet;
use App\Models\PetInteraction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PetController extends Controller
{
    /**
     * Get all active pets
     */
    public function index()
    {
        try {
            $pets = Pet::where('user_id', null)
                ->where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $pets
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pets',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new pet
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => ['required', Rule::in(['speaki', 'erpin'])],
                'position' => 'nullable|array',
                'position.x' => 'nullable|numeric|min:0',
                'position.y' => 'nullable|numeric|min:0',
            ]);

            $pet = Pet::create([
                'user_id' => null,
                'type' => $validated['type'],
                'name' => null,
                'level' => 1,
                'happiness' => 100,
                'position' => $validated['position'] ?? ['x' => 100, 'y' => 100],
                'stats' => [],
                'is_active' => true
            ]);

            // Log creation
            PetInteraction::log($pet->id, 'created', [
                'type' => $pet->type,
                'timestamp' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pet created successfully',
                'pet' => $pet
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create pet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update pet position (auto-save)
     */
    public function updatePosition(Request $request, Pet $pet)
    {
        try {
            $validated = $request->validate([
                'x' => 'required|numeric',
                'y' => 'required|numeric'
            ]);

            $pet->updatePosition($validated['x'], $validated['y']);

            return response()->json([
                'success' => true,
                'message' => 'Position updated',
                'position' => $pet->position
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update position',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Log interaction
     */
    public function interact(Request $request, Pet $pet)
    {
        try {
            $validated = $request->validate([
                'interaction_type' => 'required|string|max:50',
                'data' => 'nullable|array'
            ]);

            PetInteraction::log(
                $pet->id,
                $validated['interaction_type'],
                $validated['data'] ?? []
            );

            // Update happiness based on interaction
            if (in_array($validated['interaction_type'], ['pet', 'feed', 'play'])) {
                $pet->increaseHappiness(10);
            }

            return response()->json([
                'success' => true,
                'message' => 'Interaction logged',
                'pet' => $pet->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to log interaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update pet data
     */
    public function update(Request $request, Pet $pet)
    {
        try {
            $validated = $request->validate([
                'name' => 'nullable|string|max:255',
                'happiness' => 'nullable|integer|min:0|max:100',
                'is_active' => 'nullable|boolean'
            ]);

            $pet->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pet updated successfully',
                'pet' => $pet
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update pet',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete pet
     */
    public function destroy(Pet $pet)
    {
        try {
            // Log deletion
            PetInteraction::log($pet->id, 'deleted', [
                'timestamp' => now()
            ]);

            $pet->delete();

            return response()->json([
                'success' => true,
                'message' => 'Pet deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete pet',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
