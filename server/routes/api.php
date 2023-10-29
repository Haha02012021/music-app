<?php

use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\SongController;
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

Route::middleware('auth.api')->group(function () {
    // Auth
    Route::get('auth/user', [AuthenticateController::class, 'getAuthUser']);

    // Album
    Route::prefix('album')->name('album.')->group(function () {
        Route::post('create', [AlbumController::class, 'create'])->name('create');
    });
});

Route::prefix('song')->name('song.')->group(function () {
    Route::get('lastest/{isVietNamese?}', [SongController::class, 'getNewLastestSongs'])->name('newLastest');
});