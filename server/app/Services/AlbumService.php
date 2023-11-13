<?php

namespace App\Services;

use App\Models\Song;

class AlbumService 
{
    protected FileService $fileService;

    public function __construct(FileService $fileService) {
        $this->fileService = $fileService;
    }

    public function updateSingersSongs($songIds, $album) {
        if ($songIds) {
            $album->songs()->detach();
            $album->singers()->detach();
            $songs = Song::with('singers')->whereIn('id', $songIds)->get();
            $singerIds = $songs->pluck('singers')->flatten(1)->values()->pluck('id')->toArray();
            $album->songs()->attach($songIds);
            $album->singers()->attach($singerIds);
        }
    }

    public function updateThumbnail($request, $name) {
        $t = [];
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailData = $this->fileService->uploadFile($thumbnail, 'thumbnails/', $name);
            $t['thumbnail'] = $thumbnailData['fileName'];
        }

        return $t;
    }
}