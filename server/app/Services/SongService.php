<?php
namespace App\Services;

class SongService
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function updateAudioAndThumbnail($request, $name)
    {
        $medias = [];
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailData = $this->fileService->uploadFile($thumbnail, THUMBNAILS_DIR, $request->input('name') ?? $name);

            $medias['thumbnail'] = $thumbnailData['fileName'];
        }

        if ($request->hasFile('audio')) {
            $audio = $request->file('audio');
            $audioData = $this->fileService->uploadFile($audio, AUDIOES_DIR, $request->input('name') ?? $name);
            $medias['audio'] = $audioData['fileName'];
            $medias['duration'] = $audioData['duration'];
        }
        return $medias;
    }
}