<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlbumRequest;
use App\Models\Album;

class AlbumController extends Controller
{
    public function create(AlbumRequest $request) {
        $data = [
            'title' => $request->input('title'),
            'type' => $request->input('type'),
            'released_at' => $request->input('released_at'),
            'account_id' => $request->authAccount()->id,
        ];
        $album = Album::create($data);

        $songIds = $request->input('song_ids');
        $album->songs()->attach($songIds);

        return response()->json([
            'success' => true,
            'data' => $album,
            'message' => 'Tạo album thành công!'
        ]);
    }
}
