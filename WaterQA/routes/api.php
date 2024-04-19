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





Route::middleware(['status.verify', 'auth:jwt'])->group(function() {
    Route::post('/paquete/create',[PaquetesController::class,'store']);
    Route::get('/paquetes',[PaquetesController::class,'index'])->middleware('auth:jwt');
    Route::get('/buscar/paquete/{id}',[PaquetesController::class,'show'])->middleware('auth:jwt');
    Route::get('/get/id',[UsersController::class,'getUserIdFromToken']);
    Route::get('/user',[UsersController::class,'me']);
    Route::post('/change/led/{id}',[PaquetesController::class,'cambiarLed'])
        ->where('id', '[0-9]+');
    Route::get('/historial/{id}',[HistorialPaquetesController::class,'show'])
    ->where('id', '[0-9]{2}');
    Route::get('/get/data/sensor/{id}',[HistorialPaquetesController::class,'index'])->where('id', '[0-9]{2}');
    Route::put('/edit/paquete/{id}',[PaquetesController::class,'update'])
        ->where('id', '[0-9]+');
    Route::delete('/status/paquete/{id}',[PaquetesController::class,'destroy']);
    Route::post('/historial/avarage',[HistorialPaquetesController::class,'avarge_per_day']);
    Route::get('/historial/app/{id}',[HistorialPaquetesController::class,'index_app']);
});

Route::post('/historial/save',[HistorialPaquetesController::class,'store']);


