<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Http\Requests\Genre\GenreCreateRequest;
use App\Http\Requests\Genre\GenreUpdateRequest;
use App\Models\Album;
use App\Models\Genre;
use App\Services\FileService;

class GenreController extends Controller
{
    private FileService  $fileService;

    /**
     * Define constructors.
     * 
     * @param (\App\Services\FileService): $fileService
     */
    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function getAllGenres(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }
        $genres = Genre::with('account')
                    ->paginate($limit);
        foreach ($genres->items() as $genre) {
            $genre->albums_slice = Album::whereHas('songs.genres', function ($query) use ($genre) {
                                        $query->where('name', $genre->name);
                                    })
                                    ->withLiked($authId)
                                    ->withCount('actions')
                                    ->orderByDesc('actions_count')
                                    ->orderByDesc('released_at')
                                    ->limit($limit)
                                    ->get()
                                    ->map(function ($album) {
                                        if (!str_contains($album->thumbnail, 'https')) {
                                            $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                                        }
                                        return $album;
                                    });
        }

        return response()->json([
            'success' => true,
            'data' => $genres,
        ]);
    }

    public function getAllShortGenres(CustomRequest $request) {
        $keyword = $request->keyword ?? '';
        $limit = $request->limit ?? PAGE_LENGTH;
        $genres = Genre::where('name', 'like', '%'.trim($keyword).'%')
                    ->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $genres,
        ]);
    }

    public function getGenreById(int $id) {
        $genre = Genre::find($id)->with('account')->first();
        if ($genre) {
            return response()->json([
                'success' => true,
                'data' => $genre,
                'message' => 'Lấy thể loại thành công!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại genre id!',
            ], 404);
        }
    }

    public function create(GenreCreateRequest $request) {
        $authAccount = $request->authAccount();
        $data = $request->input();
        $data['admin_id'] = $authAccount->id;

        Genre::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo thể loại thành công!',
        ]);
    }

    public function update(GenreUpdateRequest $request) {
        $id = $request->input('id');
        $genre = Genre::find($id);
        $genre->update($request->except('id'));

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thể loại thành công!',
        ]);
    }

    public function delete(int $id) {
        $genre = Genre::find($id);
        if ($genre) {
            $genre->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa thể loại thành công!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không tồn tại genre id!',
        ], 404);
    }
}
