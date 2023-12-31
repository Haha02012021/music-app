<?php

namespace App\Http\Controllers;

use App\Enums\ActionType;
use App\Enums\Role;
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
                    'lyric' => $request->input('lyric'),
                    'released_at' => $request->input('released_at'),
                ];
    
                try {
                    $medias = $this->songService->updateAudioAndThumbnail($request, $data['name']);
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
        $limit = $request->limit ?? 40;
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $isVietNamese = $request->isVietNamese;
        $songs = Song::select([
                        'songs.id', 
                        'songs.name', 
                        'songs.thumbnail', 
                        'songs.lyric', 
                        'songs.duration',
                        'songs.audio', 
                        'songs.released_at'
                    ])
                    ->withLiked($authId)
                    ->with('genres')
                    ->with('singers')
                    ->orderByDesc('released_at')
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
                    ->limit($limit)
                    ->get()
                    ->map(function ($value) {
                        if ($value->thumbnail && !str_contains($value->thumbnail, 'https')) {
                            $value->thumbnail = $this->fileService->getFileUrl($value->thumbnail, THUMBNAILS_DIR);
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
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $song = Song::with('author', 'singers', 'genres')
            ->withCount([
                'actions as listens_count' => function ($query) {
                    $query->where('type', ActionType::LISTEN);
                },
                'actions as likes_count' => function ($query) {
                    $query->where('type', ActionType::LIKE);
                },
            ])
            ->withLiked($authId)
            ->find($id);
        
        if (!str_contains($song->thumbnail, 'https')) {
            $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
        }

        if (!str_contains($song->audio, 'https')) {
            $song->audio = $this->fileService->getFileUrl($song->audio, AUDIOES_DIR);
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
        $medias =  $this->songService->updateAudioAndThumbnail($request, $song->name);
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

    // Get all songs
    public function getAllSongs(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $limit = $request->limit;
        $keyword = $request->keyword ?? "";
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
                    ->where('name', 'like', '%'.$keyword.'%')
                    ->with('singers', 'genres')
                    ->withLiked($authId)
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
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $genreId = $request->genreId;
        $genre = Genre::find($genreId);

        if ($genre) {
            $songs = $genre->songs()
                        ->with('singers')
                        ->withLiked($authId)
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

    public function getSongsBySingerId(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $singerId = $request->singerId;
        $songs = Singer::find($singerId)
                        ->songs()
                        ->with('singers')
                        ->withLiked($authId)
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

    public function getUploadedSongs(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $songs = $authAccount->songs
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
            $deletedTime = now();
            $song->update([
                'name' => $song->name.'`'.$deletedTime,
            ]);
            $this->fileService->deleteFile($song->thumbnail, THUMBNAILS_DIR);
            $this->fileService->deleteFile($song->audio, AUDIOES_DIR);
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

    // Get 100 top new songs 
    public function getTopNewSongs(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $first_date = date('Y-m-d',strtotime('first day of this month'));
        $last_date = date('Y-m-d',strtotime('last day of this month'));
        $songs = Song::whereBetween('released_at', [$first_date, $last_date])
                    ->withLiked($authId)
                    ->whereRelation('author', 'role', Role::ADMIN)
                    ->withCount('actions')
                    ->with('singers')
                    ->orderByDesc('created_at')
                    ->orderByDesc('actions_count')
                    ->limit(100)
                    ->get()
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
