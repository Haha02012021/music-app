<?php

use App\Http\Controllers\ActionController;
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
        Route::put('update', [AlbumController::class, 'update'])->name('update');
    });
});

Route::prefix('song')->name('song.')->group(function () {
    Route::get('lastest/{isVietNamese?}', [SongController::class, 'getNewLastestSongs'])->name('newLastest');
    Route::get('{id}', [SongController::class, 'getSongById'])->name('detail');
});

Route::prefix('album')->name('album.')->group(function () {
    Route::get('{id}', [AlbumController::class, 'getAlbumById'])->name('detail');
<<<<<<< HEAD
});

Route::prefix('action')->name('song.')->group(function () {
    Route::post('listen', [ActionController::class, 'listen'])->name('listen');
    Route::get('listen/albums', [ActionController::class, 'getListendAlbums'])->name('listen.get-albums');
    Route::get('listen/lastest-song', [ActionController::class, 'getListenedLastestSong'])->name('listen.lastest-song');
});
=======
});
>>>>>>> d29ad276d9f5d0e82408dae495ac96afc447b6ce
