<?php

use App\Http\Controllers\AuthenticateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('login-social', [AuthenticateController::class, 'loginSocial']);

Route::get('callback/{provider}', [AuthenticateController::class, 'callbackSocial']);

Route::get('auth/user', [AuthenticateController::class, 'getAuthUser']);