<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VehiclesController;
use App\Http\Controllers\OfficerController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthController::class, 'index'])->name('login');
Route::get('/register', [AuthController::class, 'registerPage']);

Route::group(['prefix' => 'panel-control'], function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/vehicles', [VehiclesController::class, 'indexPage']);
    Route::get('/Officers', [OfficerController::class, 'indexPage']);

});
