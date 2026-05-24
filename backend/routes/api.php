<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\CompanyDashboardController;


Route::get('/companies/dashboard', [CompanyDashboardController::class, 'index']);
Route::apiResource('companies', CompanyController::class);
