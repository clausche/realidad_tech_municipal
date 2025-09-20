<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\TechnologicalSurveyController;
use App\Http\Controllers\DashboardController; // <-- 1. AÑADE ESTE IMPORT

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // 2. REEMPLAZA LA RUTA DEL DASHBOARD ANTIGUA POR ESTA
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- Rutas de recursos ---
    Route::resource('products', ProductController::class);
    Route::resource('surveys', TechnologicalSurveyController::class); // <-- 3. DEJA SOLO UNA DE ESTAS LÍNEAS
        Route::resource('applicants', ApplicantController::class);


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
