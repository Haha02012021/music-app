<?php

namespace App\Http\Controllers;

use App\Http\Requests\SongRequest;
use App\Models\Song;
use Illuminate\Support\Facades\DB;

class SongController extends Controller
{
    public function create(SongRequest $request) {
        $newSong = Song::create($request);

        return response()->json([
            'success' => true,
            'data' => $newSong,
            'message' => 'Tạo bài hát thành công!'
        ]);
    }

    public function getNewLastestSongs(?int $isVietNamese = null) {
        $songs = Song::with('genres')
                    ->with('singers')
                    ->select([
                        'songs.id', 
                        'songs.name', 
                        'songs.thumbnail', 
                        'songs.lyric', 
                        'songs.duration',
                        'songs.audio', 
                        'songs.released_at'
                    ])
                    ->joinSub(DB::table(function ($query) {
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
                    ->orderByDesc('released_at')
                    ->limit(40)
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $songs,
            'message' => 'Lấy các bài hát mới nhất thành công!'
        ]);
    }
}
