<?php

namespace App\Http\Controllers;

use App\Enums\ActionType;
use App\Enums\AlbumType;
use App\Http\Requests\Album\AlbumCreateRequest;
use App\Http\Requests\Album\AlbumUpdateRequest;
use App\Http\Requests\CustomRequest;
use App\Models\Album;
use App\Models\Genre;
use App\Models\Singer;
use App\Services\AlbumService;
use App\Services\FileService;
use Exception;
use Illuminate\Http\Request;
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
                    $this->albumService->updateSingersSongs($songIds, $album);
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
        $id = $request->input('id');
        $album = Album::find($id);
        $data = $request->except(['id', 'song_ids', 'thumbnail']);
        $media = $this->albumService->updateThumbnail($request, $album->title);
        $data = array_merge($data, $media);
        $album->update($data);
        
        $songIds = $request->input('song_ids');
        $this->albumService->updateSingersSongs($songIds, $album);

        return response()->json([
            'success' => true,
            'message' => 'Update playlist/album thành công!',
        ]);
    }

    public function getAlbumById(CustomRequest $request) {
        $id = $request->route('id');
        $album = Album::with('author', 'singers')
                    ->withCount([
                        'actions as listens_count' => function ($query) {
                            $query->where('type', ActionType::LISTEN);
                        },
                        'actions as likes_count' => function ($query) {
                            $query->where('type', ActionType::LIKE);
                        },
                    ])
                    ->withExists('actions as is_liked', function ($query) use ($request) {
                        $query->where('account_id', $request->authAccount()->id)
                                ->where('type', ActionType::LIKE);
                    })
                    ->find($id);
        $songs = $album->songs($request->authAccount()->id)->get()
                    ->map(function ($song) {
                        $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, 'thumbnails/');
                        return $song;
                    });
        $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, 'thumbnails/');
        $album->songs = $songs;

        if ($album) {
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
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }
        $albums = Album::select([
                        'id',
                        'title',
                        'thumbnail',
                    ])
                    ->withExists('actions as is_liked', function ($query) use ($request) {
                        $query->where('account_id', $request->authAccount()->id)
                            ->where('type', ActionType::LIKE);
                    })
                    ->with('singers')
                    ->paginate($limit);
        collect($albums->items())->map(function ($album) use ($request) {
            $album->songs_count = $album->songs($request->authAccount()->id)->count();
            if (str_contains($album->thumbnail, 'https')) {
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

        if ($genre) {
            $albums = $genre->songs()
                        ->with('albums', 'albums.singers')
                        ->get()
                        ->pluck('albums')
                        ->flatten(1)
                        ->unique('id')
                        ->values()
                        ->map(function ($album) use ($request) {
                            if (!str_contains($album->thumbnail, 'https')) {
                                $album->is_liked = $album->where('account_id', $request->authAccount()->id)
                                                        ->where('type', ActionType::LIKE)
                                                        ->exists();
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
        $singerId = $request->singerId;
        $albums = Singer::find($singerId)
                        ->albums()
                        ->with('singers')
                        ->withExists('actions as is_liked', function ($query) use ($request) {
                            $query->where('account_id', $request->authAccount()->id)
                                ->where('type', ActionType::LIKE);
                        })
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
}
