<?php

use App\Http\Controllers\UsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::get('/get/users',[UsersController::class,'index']);
Route::post('/post/users',[UsersController::class,'store']);

Route::get('/get/id',[UsersController::class,'getUserIdFromToken']);
