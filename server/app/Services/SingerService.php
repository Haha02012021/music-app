<?php
namespace App\Services;

class SingerService
{
    protected FileService $fileService;

    public function __construct(FileService $fileService) {
        $this->fileService = $fileService;
    }

    public function updateThumbnail($request, $name)
    {
        if ($request->hasFile('thumbnail')) {
            $thumbnailData = $this->fileService->uploadFile($request->file('thumbnail'), THUMBNAILS_DIR, $name);
            return $thumbnailData['fileName'];
        }
        return null;
    }
}