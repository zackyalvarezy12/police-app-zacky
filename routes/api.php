<?php

use App\Http\Controllers\OfficerController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehiclesController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



Route::group(['prefix' => 'panel-control', 'middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // vehicles routes
    Route::apiResource('vehicles', VehiclesController::class);
    //officer routes
     Route::apiResource('officers', OfficerController::class);

});
