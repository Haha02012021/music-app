<?php

namespace App\Http\Controllers;

use App\Enums\ActionType;
use App\Enums\ActionItem;
use App\Enums\AlbumType;
use App\Http\Requests\Album\AlbumCreateRequest;
use App\Http\Requests\Album\AlbumUpdateRequest;
use App\Http\Requests\CustomRequest;
use App\Jobs\Album\UpdateTop100;
use App\Models\Album;
use App\Models\Genre;
use App\Models\Singer;
use App\Services\AlbumService;
use App\Services\FileService;
use Illuminate\Support\Facades\DB;

class AlbumController extends Controller
{
    private AlbumService $albumService;
    private FileService  $fileService;

    /**
     * Define constructors.
     * 
     * @param (\App\Services\AlbumService): $albumService
     */
    public function __construct(AlbumService $albumService, FileService $fileService)
    {
        $this->albumService = $albumService;
        $this->fileService = $fileService;
    }

    public function create(AlbumCreateRequest $request) {
        try {
            DB::transaction(function () use ($request) {
                $authAccount = $request->authAccount();
                $authId = $authAccount ? $authAccount->id : null;
                $data = [
                    'title' => $request->input('title'),
                    'type' => AlbumType::ALBUM,
                    'released_at' => $request->input('released_at'),
                    'account_id' => $request->authAccount()->id,
                ];
                $media = $this->albumService->updateThumbnail($request, $data['title']);
                $data = array_merge($data, $media);
                $album = Album::create($data);
        
                $songIds = $request->input('song_ids');
                try {
                    $this->albumService->updateSingersSongs($songIds, $album, $authId);
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Tạo album thành công!'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function createPlaylist(AlbumCreateRequest $request) {
        $data = [
            'title' => $request->input('title'),
            'type' => AlbumType::PLAYLIST,
            'account_id' => $request->authAccount()->id,
        ];
        $media = $this->albumService->updateThumbnail($request, $data['title']);
        $data = array_merge($data, $media);

        $playlist = Album::create($data);

        return response()->json([
            'success' => true,
            'data' => $playlist,
            'message' => 'Tạo playlist thành công!'
        ]);
    }

    public function update(AlbumUpdateRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $id = $request->input('id');
        $album = Album::find($id);
        $data = $request->except(['id', 'song_ids', 'thumbnail']);
        $media = $this->albumService->updateThumbnail($request, $album->title);
        $data = array_merge($data, $media);
        $album->update($data);
        
        $songIds = $request->input('song_ids');
        $this->albumService->updateSingersSongs($songIds, $album, $authId);

        return response()->json([
            'success' => true,
            'message' => 'Update playlist/album thành công!',
        ]);
    }

    public function getPlaylists(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $playlists = $authAccount->albums()
                                ->where('type', AlbumType::PLAYLIST)
                                ->orderByDesc('updated_at')
                                ->with('singers')
                                ->withLiked($authId)
                                ->get()
                                ->map(function ($playlist) use ($authAccount) {
                                    $playlist->song_ids = $playlist->songs($authAccount->id)->get('id');
                                    if ($playlist->thumbnail && !str_contains($playlist->thumbnail, 'https')) {
                                        $playlist->thumbnail = $this->fileService->getFileUrl($playlist->thumbnail, THUMBNAILS_DIR);
                                    }
                                    return $playlist;
                                });
        
        return response()->json([
            'data' => $playlists,
            'message' => 'Lấy các playlist thành công!'
        ]);
    }

    public function getAlbumById(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $id = $request->route('id');
        $album = Album::with('author', 'singers')
                    ->withCount([
                        'actions as listens_count' => function ($query) {
                            return $query->where('type', ActionType::LISTEN);
                        },
                        'actions as likes_count' => function ($query) {
                            return $query->where('type', ActionType::LIKE);
                        },
                    ])
                    ->withLiked($authId)
                    ->find($id);

        if ($album) {
            $songs = $album->songs($authId)->get()
                    ->map(function ($song) {
                        if (!str_contains($song->thumbnail, 'https')) {
                            $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                        }
                        return $song;
                    });
            $album->thumbnail = !str_contains($album->thumbnail, 'https') ? $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR) : $album->thumbnail;
            $album->songs = $songs;

            return response()->json([
                'success' => true,
                'data' => $album,
                'message' => 'Lấy album thành công!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại id album!',
            ], 404);
        }
    }

    public function getAllAlbums(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount->id;
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }
        $albums = Album::select([
                        'id',
                        'title',
                        'thumbnail',
                    ])
                    ->where('type', AlbumType::ALBUM)
                    ->withLiked($authId)
                    ->with('singers')
                    ->paginate($limit);
        collect($albums->items())->map(function ($album) use ($request) {
            $album->songs_count = $album->songs($request->authAccount()->id)->count();
            if (!str_contains($album->thumbnail, 'https')) {
                $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
            }

            return $album;
        });
        return response()->json([
            'success' => true,
            'data' => $albums,
        ]);
    }

    public function getAlbumsByGenreId(CustomRequest $request) {
        $genreId = $request->genreId;
        $genre = Genre::find($genreId);

        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        if ($genre) {
            $albums = Album::whereHas('songs.genres', function ($query) use ($genre) {
                            $query->where('name', $genre->name);
                        })
                        ->withLiked($authId)
                        ->withCount('actions')
                        ->orderByDesc('actions_count')
                        ->orderByDesc('released_at')
                        ->get()
                        ->map(function ($album) {
                            if (!str_contains($album->thumbnail, 'https')) {
                                $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                            }
                            return $album;
                        });
            return response()->json([
                'success' => true,
                'data' => $albums,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại genre id!',
            ], 404);
        }
    }

    public function getAlbumsBySingerId(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $singerId = $request->singerId;
        $albums = Singer::find($singerId)
                        ->albums()
                        ->with('singers')
                        ->withLiked($authId)
                        ->get()
                        ->map(function ($album) {
                            if (!str_contains($album->thumbnail, 'https')) {
                                $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                            }
                            return $album;
                        });

        return response()->json([
            'success' => true,
            'data' => $albums,
        ]);
    }

    public function delete(int $id) {
        $album = Album::find($id);
        if ($album) {
            $deletedTime = now();
            $album->update([
                'name' => $album->title.'`'.$deletedTime,
            ]);
            $this->fileService->deleteFile($album->thumbnail, THUMBNAILS_DIR);
            $album->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa album/playlist thành công!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không tồn tại album id!',
        ], 404);
    }

    public function getHotAlbums(CustomRequest $request) {
        $limit = $request->limit ?? 20;
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $albums = Album::where('type', AlbumType::ALBUM)
                ->orWhere('type', AlbumType::PLAYLIST)
                ->has('songs')
                ->with('songs')
                ->withLiked($authId)
                ->withCount('actions')
                ->orderByDesc('released_at')
                ->get()
                ->sortByDesc(function ($album) {
                    $songs = $album['songs'];
                    $songs_count = $songs->count();
                    $songs_actions_count = $songs->sum('actions_count');
                    if ($songs_count)
                        return ($songs_actions_count + $album['actions_count']) / $songs_count;
                    return 0;
                })
                ->take($limit)
                ->map(function ($album) {
                    unset($album['songs']);
                    if (!str_contains($album->thumbnail, 'https')) {
                        $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                    }
                    return $album;
                })
                ->flatten(1);
        
        return response()->json([
            'success' => true,
            'data' => $albums,
        ]);
    }

    public function getTop100(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $albums = Album::where('type', 'like', AlbumType::TOP100.'%')
                        ->withLiked($authId)
                        ->withCount('actions')
                        ->orderByDesc('released_at')
                        ->get();

        $outstanding = 'Nổi bật';
        $vietnam = 'Việt Nam';
        $usuk = 'Âu Mỹ';

        $onlyOutstanding = $request->onlyOutstanding;
        if (count($albums) !== 0) {
            $albumsList = [];
            if (!$onlyOutstanding) {
                $albumsList = $albums->groupBy(function ($album) {
                                        return substr($album['type'], 2);
                                    })
                                    ->map(function ($items, $title) {
                                        $box = [];
                                        $box['title'] = 'Nhạc '.$title;
                                        $box['albums'] = collect($items)->map(function ($item) {
                                            if (!str_contains($item->thumbnail, 'https')) {
                                                $item->thumbnail = $this->fileService->getFileUrl($item->thumbnail, THUMBNAILS_DIR);
                                            }
                                            return $item;
                                        });
                                        return $box;
                                    })
                                    ->values()
                                    ->toArray();
            }
            $outstandingAlbumsList = [[
                'title' => $outstanding,
                'albums' => $this->albumService->getOutstandingAlbums($authId),
            ]];

            return response()->json([
                'success' => true,
                'data' => array_merge($outstandingAlbumsList, $albumsList),
            ]);
        } else {
            $vietnamSongs = $this->albumService->getSongsByGenreName($vietnam);
            $usukSongs = $this->albumService->getSongsByGenreName($usuk);
            $asiaSongs = $this->albumService->getSongsOfAsia();

            $vietnamAlbums = $vietnamSongs->map(function ($item) use ($authId) {
                return $this->albumService->createTop100($item, $authId);
            });

            $newAsiaAlbums = $asiaSongs->map(function ($item) use ($authId) {
                return $this->albumService->createTop100($item, $authId);
            });

            $usukAlbums = $usukSongs->map(function ($item) use ($authId) {
                return $this->albumService->createTop100($item, $authId);
            });

            $outstandingAlbums = $this->albumService->getOutstandingAlbums($authId);

            return response()->json([
                'success' => true,
                'data' => [
                    [
                        'title' => $outstanding,
                        'albums' => $outstandingAlbums,
                    ],
                    [
                        'title' => 'Nhạc Việt Nam',
                        'albums' => $vietnamAlbums,
                    ],
                    [
                        'title' => 'Nhạc Châu Á',
                        'albums' => $newAsiaAlbums,
                    ],
                    [
                        'title' => 'Nhạc Âu Mỹ',
                        'albums' => $usukAlbums,
                    ]
                ],
            ]);
        }
    }

    public function updateTop100() {
        $updateTop100Job = new UpdateTop100();
        dispatch($updateTop100Job);
    }
}
