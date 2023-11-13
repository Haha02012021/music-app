<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Models\Genre;
use Illuminate\Http\Request;

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
}
