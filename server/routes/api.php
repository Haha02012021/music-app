<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActionController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\GenreController;
use App\Http\Controllers\SingerController;
use App\Http\Controllers\SongController;
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
    Route::post('auth/logout', [AuthenticateController::class, 'logout']);

    Route::post('follow/singer/{singerId}', [AccountController::class, 'follow']);

    // Album
    Route::prefix('album')->name('album.')->group(function () {
        Route::post('create', [AlbumController::class, 'create'])->name('create');
        Route::post('update', [AlbumController::class, 'update'])->name('update');
    });

    // Playlist
    Route::prefix('playlist')->name('playlist.')->group(function () {
        Route::post('create', [AlbumController::class, 'createPlaylist'])->name('create');
        Route::get('all', [AlbumController::class, 'getPlaylists'])->name('all');
    });

    // Song
    Route::prefix('song')->name('song.')->group(function () {
        Route::post('create', [SongController::class, 'create'])->name('create');
        Route::post('update', [SongController::class, 'update'])->name('update');
        Route::get('uploaded', [SongController::class, 'getUploadedSongs'])->name('uploaded');
    });

    // Action like
    Route::prefix('action/like')->name('action.')->group(function () {
        Route::post('', [ActionController::class, 'like'])->name('');
        Route::get('albums', [ActionController::class, 'getLikedAlbums'])->name('get-albums');
        Route::get('songs', [ActionController::class, 'getLikedSongs'])->name('get-songs');
    });

    // Only role admin
    Route::middleware('role.admin')->group(function () {
        Route::delete('song/{id}', [SongController::class, 'delete'])->name('song.delete');
        Route::get('albums', [AlbumController::class, 'getAllAlbums'])->name('album.all');
        Route::delete('album/{id}', [AlbumController::class, 'delete'])->name('album.delete');
        Route::prefix('genre')->name('genre.')->group(function () {
            Route::post('create', [GenreController::class, 'create'])->name('create');
            Route::put('update', [GenreController::class, 'update'])->name('update');
            Route::get('all-short', [GenreController::class, 'getAllShortGenres'])->name('all-short');
            Route::delete('{id}', [GenreController::class, 'delete'])->name('delete');
        });
        Route::prefix('singer')->name('singer.')->group(function () {
            Route::post('create', [SingerController::class, 'create'])->name('create');
            Route::post('update', [SingerController::class, 'update'])->name('update');
            Route::delete('{id}', [SingerController::class, 'delete'])->name('delete');
            Route::get('all', [SingerController::class, 'getAllSingers'])->name('all');
        });
    });
});

Route::get('search', [AccountController::class, 'search']);

Route::get('songs', [SongController::class, 'getAllSongs'])->name('song.all');
Route::prefix('song')->name('song.')->group(function () {
    Route::get('top', [SongController::class, 'getTopNewSongs'])->name('song');
    Route::get('lastest/{isVietNamese?}', [SongController::class, 'getNewLastestSongs'])->name('newLastest');
    Route::get('{id}', [SongController::class, 'getSongById'])->name('detail');
    Route::get('genre/{genreId}', [SongController::class, 'getSongsByGenreId'])->name('genre-id');
    Route::get('singer/{singerId}', [SongController::class, 'getSongsBySingerId'])->name('singer-id');
});

Route::prefix('album')->name('album.')->group(function () {
    Route::get('top-100', [AlbumController::class, 'getTop100'])->name('top-100');
    Route::get('top', [AlbumController::class, 'getHotAlbums'])->name('top');
    Route::get('{id}', [AlbumController::class, 'getAlbumById'])->name('detail');
    Route::get('genre/{genreId}', [AlbumController::class, 'getAlbumsByGenreId'])->name('genre-id');
    Route::get('singer/{singerId}', [AlbumController::class, 'getAlbumsBySingerId'])->name('singer-id');
});

Route::prefix('singer')->name('singer.')->group(function () {
    Route::get('top', [SingerController::class, 'getTopSingers'])->name('top');
    Route::get('{id}', [SingerController::class, 'getSingerById'])->name('detail');
});

Route::prefix('genre')->name('genre.')->group(function () {
    Route::get('all', [GenreController::class, 'getAllGenres'])->name('all');
    Route::get('{id}', [GenreController::class, 'getGenreById'])->name('detail');
});

Route::prefix('action/listen')->name('action.listen')->group(function () {
    Route::post('', [ActionController::class, 'listen'])->name('');
    Route::get('albums', [ActionController::class, 'getListendAlbums'])->name('get-albums');
    Route::get('lastest-song', [ActionController::class, 'getListenedLastestSong'])->name('lastest-song');
});
