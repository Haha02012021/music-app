<?php

namespace App\Http\Controllers;

use App\Enums\ActionType;
use App\Http\Requests\CustomRequest;
use App\Http\Requests\Song\SongCreateRequest;
use App\Http\Requests\Song\SongUpdateRequest;
use App\Models\Genre;
use App\Models\Singer;
use App\Models\Song;
use App\Services\FileService;
use App\Services\SongService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SongController extends Controller
{
    protected FileService $fileService;
    protected SongService $songService;

    public function __construct(FileService $fileService, SongService $songService) {
        $this->fileService = $fileService;
        $this->songService = $songService;
    }

    public function create(SongCreateRequest $request) {
        try {
            DB::transaction(function () use ($request) {
                $authAccount = $request->authAccount();
    
                $data = [
                    'name' => $request->input('name'),
                    'account_id' => $authAccount->id,
                    'album_id' => $request->input('album_id'),
                    'lyric' => $request->input('lyric'),
                    'released_at' => $request->input('released_at'),
                ];
    
                try {
                    $medias = $this->songService->updateAudioAndThumbnail($request, $data);
                    $data = array_merge($data, $medias);
                } catch (\Throwable $th) {
                    DB::rollBack();
                    return $th;
                }
    
                $newSong = Song::create($data);
                $newSong->singers()->attach($request->singer_ids);
                $newSong->genres()->attach($request->input('genre_ids'));
            });
    
            return response()->json([
                'success' => true,
                'message' => 'Tạo bài hát thành công!'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }

    public function getNewLastestSongs(CustomRequest $request) {
        $isVietNamese = $request->isVietNamese;
        $songs = Song::orderByDesc('released_at')
                    ->with('genres')
                    ->with('singers')
                    ->withExists('actions as is_liked', function ($query) use ($request) {
                        $authAccount = $request->authAccount();
                        if ($authAccount) {
                            $query->where('account_id', $request->authAccount()->id)
                                ->where('type', ActionType::LIKE);
                        }
                    })
                    ->select([
                        'songs.id', 
                        'songs.name', 
                        'songs.thumbnail', 
                        'songs.lyric', 
                        'songs.duration',
                        'songs.audio', 
                        'songs.released_at'
                    ])
                    ->leftJoinSub(DB::table(function ($query) {
                        $query
                            ->select([
                                'songs_genres.song_id as id',
                                DB::raw('group_concat(genres.name separator ", ") as genre_names'),
                            ])
                            ->from('genres')
                            ->join('songs_genres', 'genres.id', 'songs_genres.genre_id')
                            ->groupBy('songs_genres.song_id');
                    }), 't', 't.id', 'songs.id')
                    ->where(function ($query) use ($isVietNamese) {
                        switch ($isVietNamese) {
                            case '1':
                                $query->where('t.genre_names', 'like', '%Việt Nam%');
                                break;
                            case '0':
                                $query->whereNot('t.genre_names', 'like', '%Việt Nam%');
                                break;
                            default:
                                break;
                        }
                    })
                    ->limit(40)
                    ->get()
                    ->map(function ($value) {
                        if (!str_contains($value->thumbnail, 'https')) {
                            $value->thumbnail = $this->fileService->getFileUrl($value->thumbnail, 'thumbnails');
                        }

                        return $value;
                    });

        return response()->json([
            'success' => true,
            'data' => $songs,
            'message' => 'Lấy các bài hát mới nhất thành công!'
        ]);
    }

    public function getSongById(CustomRequest $request) {
        $id = $request->route('id');
        $song = Song::with('author', 'singers', 'genres')
            ->withCount([
                'actions as listens_count' => function ($query) {
                    $query->where('type', ActionType::LISTEN);
                },
                'actions as likes_count' => function ($query) {
                    $query->where('type', ActionType::LIKE);
                },
            ])
            ->withExists('actions as is_liked', function ($query) use ($request) {
                $authAccount = $request->authAccount();
                if ($authAccount) {
                    $query->where('account_id', $request->authAccount()->id)
                        ->where('type', ActionType::LIKE);
                }
            })
            ->find($id);
        
        if (!str_contains($song->thumbnail, 'https')) {
            $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, 'thumbnails/');
        }

        if (!str_contains($song->audio, 'https')) {
            $song->audio = $this->fileService->getFileUrl($song->audio, 'audios/');
        }

        if ($song) {
            return response()->json([
                'success' => true,
                'data' => $song,
                'message' => 'Lấy bài hát thành công!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại id bài hát!',
            ], 404);
        }
    }

    public function update(SongUpdateRequest $request) {
        $songId = $request->input('id');
        $song = Song::find($songId);
        
        $data = $request->except(['audio', 'thumbnail', 'singer_ids']);
        $medias =  $this->songService->updateAudioAndThumbnail($request, $data);
        $data = array_merge($data, $medias);
        $song->update($data);

        if ($request->input('singer_ids')) {
            $song->singers()->attach($request->input('singer_ids'));
        }

        if ($request->input('genre_ids')) {
            $song->genres()->attach($request->input('genre_ids'));
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật bài hát thành công!'
        ]);
    }

    public function getAllSongs(Request $request) {
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }
        $songs = Song::select([
                        'id',
                        'name',
                        'thumbnail',
                        'duration',
                        'released_at',
                    ])
                    ->with('singers', 'genres')
                    ->withExists('actions as is_liked', function ($query) use ($request) {
                        $authAccount = $request->authAccount();
                        if ($authAccount) {
                            $query->where('account_id', $request->authAccount()->id)
                                ->where('type', ActionType::LIKE);
                        }
                    })
                    ->orderByDesc('released_at')
                    ->paginate($limit);

        collect($songs->items())->map(function ($song) {
            if (!str_contains($song->thumbnail, 'https')) {
                $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
            }

            return $song;
        });

        return response()->json([
            'success' => true,
            'data' => $songs,
        ]);
    }

    public function getSongsByGenreId(CustomRequest $request) {
        $genreId = $request->genreId;
        $genre = Genre::find($genreId);

        if ($genre) {
            $songs = $genre->songs()
                        ->with('singers')
                        ->withExists('actions as is_liked', function ($query) use ($request) {
                            $authAccount = $request->authAccount();
                            if ($authAccount) {
                                $query->where('account_id', $request->authAccount()->id)
                                    ->where('type', ActionType::LIKE);
                            }
                        })
                        ->get()
                        ->map(function ($song) {
                            if (!str_contains($song->thumbnail, 'https')) {
                                $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                            }
                            return $song;
                        });
            return response()->json([
                'success' => true,
                'data' => $songs,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại genre id!',
            ], 404);
        }
    }

    public function getSongsBySingerId(Request $request) {
        $singerId = $request->singerId;
        $songs = Singer::find($singerId)
                        ->songs()
                        ->with('singers')
                        ->withExists('actions as is_liked', function ($query) use ($request) {
                            $authAccount = $request->authAccount();
                            if ($authAccount) {
                                $query->where('account_id', $request->authAccount()->id)
                                    ->where('type', ActionType::LIKE);
                            }
                        })
                        ->get()
                        ->map(function ($song) {
                            if (!str_contains($song->thumbnail, 'https')) {
                                $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                            }
                            return $song;
                        });

        return response()->json([
            'success' => true,
            'data' => $songs,
        ]);
    }

    public function delete(int $id) {
        $song = Song::find($id);
        if ($song) {
            $song->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa bài hát thành công!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không tồn tại song id!',
        ]);
    }

    public function getTopNewSongs(CustomRequest $request) {
        $first_date = date('Y-m-d',strtotime('first day of this month'));
        $last_date = date('Y-m-d',strtotime('last day of this month'));
        $songs = Song::whereBetween('released_at', [$first_date, $last_date])
                    ->withCount('actions')
                    ->orderByDesc('created_at')
                    ->withExists('actions as is_liked', function ($query) use ($request) {
                        $authAccount = $request->authAccount();
                        if ($authAccount) {
                            $query->where('account_id', $request->authAccount()->id)
                                ->where('type', ActionType::LIKE);
                        }
                    })
                    ->get()
                    ->sortByDesc('actions_count')
                    ->take(100)
                    ->map(function ($song) {
                        if (!str_contains($song->thumbnail, 'https')) {
                            $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                        }
                        return $song;
                    })
                    ->flatten(1);

        return response()->json([
            'success' => true,
            'data' => $songs,
        ]);
    }
}
