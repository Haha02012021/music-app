<?php

namespace App\Http\Controllers;

use App\Enums\ActionItem;
use App\Enums\ActionType;
use App\Http\Requests\Action\ListenRequest;
use App\Http\Requests\CustomRequest;
use App\Models\Action;
use App\Models\Song;
use Exception;
use Illuminate\Support\Facades\DB;

class ActionController extends Controller
{
    public function listen(ListenRequest $request) {
        try {
            DB::transaction(function () use ($request) {
                $account = $request->authAccount();
                $songId = $request->input('song_id');
                $song = Song::find($songId);
    
                if (!$song) {
                    throw new Exception('Không tồn tại bài hát!', 404);
                }
    
                $albumId = $request->input('album_id');
                if ($albumId) {
                    $album = $song->whereRelation('albums', 'albums.id', $albumId)->first();
    
                    if (!$album) {
                        throw new Exception('Không tồn tại album!', 404);
                    }

                    $data = [
                        'ip' => $request->ip(),
                        'account_id' => $account !== null ? $account->id : null,
                        'item' => ActionItem::ALBUM,
                        'item_id' => $albumId,
                        'type' => ActionType::LISTEN,
                    ];

                    Action::create($data);
                }
    
                $data = [
                    'ip' => $request->ip(),
                    'account_id' => $account !== null ? $account->id : null,
                    'item' => ActionItem::SONG,
                    'item_id' => $songId,
                    'type' => ActionType::LISTEN,
                ];
    
                Action::create($data);
            });

            return response()->json([
                'success' => true,
                'message' => 'Đã nghe 1 lần!',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 404);
        }
    }

    public function getListendAlbums(CustomRequest $request) {
        $account = $request->authAccount();

        if ($account) {
            $albums = $account->listenedAlbums;
            return response()->json([
                'success' => true,
                'data' => $albums,
            ]);
        } else {
            $ip = $request->ip();
            $albums = DB::table('actions')
                        ->where('ip', $ip)
                        ->select([
                            'albums.id',
                            'albums.title',
                            'albums.description',
                            'albums.thumbnail',
                            'albums.released_at',
                            'actions.created_at as listened_at'
                        ])
                        ->join('albums', 'albums.id', 'actions.item_id')
                        ->orderByDesc('actions.created_at')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $albums,
            ]);
        }
    }

    public function getListenedLastestSong(CustomRequest $request) {
        $account = $request->authAccount();

        if ($account) {
            $song = $account->listenedSongs->first();
            return response()->json([
                'success' => true,
                'data' => $song,
            ]);
        } else {
            $ip = $request->ip();
            $song = DB::table('actions')
                        ->where('ip', $ip)
                        ->select([
                            'songs.id',
                            'songs.name',
                            'songs.thumbnail',
                            'songs.lyric',
                            'songs.duration',
                            'songs.audio',
                            'songs.released_at',
                            'song.created_at as listened_at'
                        ])
                        ->join('songs', 'songs.id', 'songs.item_id')
                        ->orderByDesc('actions.created_at')
                        ->first();

            return response()->json([
                'success' => true,
                'data' => $song,
            ]);
        }
    }
}
