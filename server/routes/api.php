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
        Route::post('update', [AlbumController::class, 'update'])->name('update');
    });

    // Playlist
    Route::prefix('playlist')->name('playlist.')->group(function () {
        Route::post('create', [AlbumController::class, 'createPlaylist'])->name('create');
    });

    Route::prefix('song')->name('song.')->group(function () {
        Route::post('create', [SongController::class, 'create'])->name('create');
        Route::post('update', [SongController::class, 'update'])->name('update');
    });
});

Route::prefix('song')->name('song.')->group(function () {
    Route::get('lastest/{isVietNamese?}', [SongController::class, 'getNewLastestSongs'])->name('newLastest');
    Route::get('{id}', [SongController::class, 'getSongById'])->name('detail');
});

Route::prefix('album')->name('album.')->group(function () {
    Route::get('{id}', [AlbumController::class, 'getAlbumById'])->name('detail');
});

Route::prefix('action/like')->name('action.')->group(function () {
    Route::post('', [ActionController::class, 'like'])->name('');
    Route::get('albums', [ActionController::class, 'getLikedAlbums'])->name('get-albums');
    Route::get('songs', [ActionController::class, 'getLikedSongs'])->name('get-songs');
});

Route::prefix('action/listen')->name('action.listen')->group(function () {
    Route::post('', [ActionController::class, 'listen'])->name('');
    Route::get('albums', [ActionController::class, 'getListendAlbums'])->name('get-albums');
    Route::get('lastest-song', [ActionController::class, 'getListenedLastestSong'])->name('lastest-song');
});
