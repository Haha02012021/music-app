<?php

namespace App\Services;

use App\Models\Song;

class AlbumService 
{
    public function updateSingersSongs($songIds, $album) {
        $album->songs()->detach();
        $album->singers()->detach();
        $songs = Song::with('singers')->whereIn('id', $songIds)->get();
        $singerIds = $songs->pluck('singers')->flatten(1)->values()->pluck('id')->toArray();
        $album->songs()->attach($songIds);
        $album->singers()->attach($singerIds);
    }
}