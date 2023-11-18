<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Http\Requests\Genre\GenreCreateRequest;
use App\Http\Requests\Genre\GenreUpdateRequest;
use App\Models\Genre;

class GenreController extends Controller
{
    public function getAllGenres(CustomRequest $request) {
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }
        $genres = Genre::with('account')
                    ->paginate($limit);
        collect($genres->items())->map(function ($genre) use ($limit) {
            $genre->songs_slice = $genre->songs->take($limit);
            $genre->songs_count = $genre->songs()->count();
            $albums = $genre->songs()
                            ->with('albums')
                            ->get()
                            ->pluck('albums')
                            ->flatten(1)
                            ->unique('id')
                            ->values();
            $genre->albums_count = $albums->count();
            $genre->albums_slice = $albums->take($limit);

            return $genre;
        });

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
