<?php

use App\Http\Controllers\PetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()
    ]);
});

// Pet API Routes
Route::prefix('pets')->name('api.pets.')->group(function () {
    Route::get('/', [PetController::class, 'index'])->name('index');
    Route::post('/', [PetController::class, 'store'])->name('store');

    // Routes dengan model binding
    Route::put('/{pet}/position', [PetController::class, 'updatePosition'])->name('position');
    Route::post('/{pet}/interact', [PetController::class, 'interact'])->name('interact');
    Route::put('/{pet}', [PetController::class, 'update'])->name('update');
    Route::delete('/{pet}', [PetController::class, 'destroy'])->name('destroy');
});
