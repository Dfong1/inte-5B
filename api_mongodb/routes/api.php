<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HistorialPaquetesController;
use App\Http\Controllers\PaquetesController;
use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Route::get('get/users/',[UsersController::class,'index']);
// Rutas para registro, verificación y login
Route::post('/register',[UsersController::class,'store']);
Route::get('/activate/{token}', [UsersController::class, 'activate'])->name('activate');
Route::post('/login',[AuthController::class,'login']);


Route::middleware(['status.verify', 'token.verify'])->group(function() {
    Route::post('/paquete/create',[PaquetesController::class,'store']);
    Route::get('/paquetes',[PaquetesController::class,'index'])->middleware('auth:jwt');
    Route::get('/get/id',[UsersController::class,'getUserIdFromToken']);
    Route::get('/user/me',[UsersController::class,'me']);
});


Route::post('/paquete/create',[PaquetesController::class,'store']);
Route::get('/paquetes',[PaquetesController::class,'index'])->middleware('auth:jwt');

Route::get('/historial/{esp_id}',[HistorialPaquetesController::class,'index']);

