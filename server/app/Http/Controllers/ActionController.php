<?php

namespace App\Http\Controllers;

use App\Enums\ActionItem;
use App\Enums\ActionType;
use App\Http\Requests\Action\LikeRequest;
use App\Http\Requests\Action\ListenRequest;
use App\Http\Requests\CustomRequest;
use App\Models\Action;
use App\Models\Song;
use App\Services\FileService;
use Exception;
use Illuminate\Support\Facades\DB;

class ActionController extends Controller
{
    protected FileService $fileService;

    public function __construct(FileService $fileService) {
        $this->fileService = $fileService;
    }

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
            $albums = $account->actedAlbums()
                            ->where('actions.type', ActionType::LISTEN)
                            ->get()
                            ->map(function ($album) {
                                if ($album->thumbnail && !str_contains($album->thumbnail, 'https')) {
                                    $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                                }
                                return $album;
                            });
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
            $song = $account->actedSongs()->where('type', ActionType::LISTEN)->first();
            $song->thumbnail = $song->thumbnail && !str_contains($song->thumbnail, 'https') 
                                    ? $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR)
                                    : $song->thumbnail;
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
            $song->thumbnail = $song->thumbnail && !str_contains($song->thumbnail, 'https') 
                                    ? $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR)
                                    : $song->thumbnail;

            return response()->json([
                'success' => true,
                'data' => $song,
            ]);
        }
    }

    public function like(LikeRequest $request) {
        $account = $request->authAccount();

        $data = [
            'item_id' => $request->input('item_id'),
            'item' => $request->input('item'),
            'account_id' => $account->id,
            'type' => ActionType::LIKE,
        ];

        $like = Action::where('item', $data['item'])
                    ->where('type', ActionType::LIKE)
                    ->where('item_id', $data['item_id'])
                    ->first();

        if ($like) {
            $like->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã bỏ like!'
            ]);
        } else {
            Action::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Đã like!',
            ]);
        }
    }

    public function getLikedAlbums(CustomRequest $request) {
        $account = $request->authAccount();

        $albums = $account->actedAlbums()
                        ->where('actions.type', ActionType::LIKE)
                        ->with('author')
                        ->get()
                        ->map(function ($album) {
                            if ($album->thumbnail && !str_contains($album->thumbnail, 'https')) {
                                $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                            }
                            return $album;
                        });

        return response()->json([
            'success' => true,
            'data' => $albums,
            'message' => 'Lấy các album đã like thành công!',
        ]);
    }

    public function getLikedSongs(CustomRequest $request) {
        $account = $request->authAccount();

        $songs = $account->actedSongs()
                        ->where('type', ActionType::LIKE)
                        ->with('author')
                        ->get()
                        ->map(function ($song) {
                            if ($song->thumbnail && !str_contains($song->thumbnail, 'https')) {
                                $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                            }
                            return $song;
                        });

        return response()->json([
            'success' => true,
            'data' => $songs,
            'message' => 'Lấy các bài hát đã like thành công!',
        ]);
    }
}
