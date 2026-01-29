<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Desktop Pet Routes
Route::prefix('desktop-pet')->name('desktop-pet.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');
    Route::get('/setup', [DashboardController::class, 'setup'])->name('setup');
    Route::post('/setup', [DashboardController::class, 'saveSetup'])->name('setup.save');
});
