<?php

namespace App\Http\Controllers;

use App\Http\Requests\Album\AlbumCreateRequest;
use App\Http\Requests\Album\AlbumUpdateRequest;
use App\Models\Album;
use App\Models\Song;
use App\Services\AlbumService;
use Exception;
use Illuminate\Support\Facades\DB;

class AlbumController extends Controller
{
    private AlbumService $albumService;

    /**
     * Define constructors.
     * 
     * @param (\App\Services\AlbumService): $albumService
     */
    public function __construct(AlbumService $albumService)
    {
        $this->albumService = $albumService;
    }

    public function create(AlbumCreateRequest $request) {
        try {
            DB::transaction(function () use ($request) {
                $data = [
                    'title' => $request->input('title'),
                    'type' => $request->input('type'),
                    'released_at' => $request->input('released_at'),
                    'account_id' => $request->authAccount()->id,
                ];
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

    public function update(AlbumUpdateRequest $request) {
        try {
            DB::transaction(function () use ($request) {
                $id = $request->input('id');
                $album = Album::find($id);

                if ($album) {
                    $album->update($request->except(['id', 'song_ids']));

                    $songIds = $request->input('song_ids');
                    $this->albumService->updateSingersSongs($songIds, $album);
                } else {
                    return new Exception('Không tồn tại id album!');
                }
            });

            return response()->json([
                'success' => true,
                'message' => 'Update album thành công!'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 404);
        }
    }

    public function getAlbumById(int $id) {
        $album = Album::with('songs')->with('singers')->find($id);

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
}
