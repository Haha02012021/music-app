<?php

namespace App\Jobs\Album;

use App\Services\AlbumService;
use App\Services\FileService;
use Google\Cloud\Storage\StorageClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Kreait\Firebase\Storage;

class UpdateTop100 implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $storageClient = new StorageClient();
        $storage = new Storage($storageClient);
        $fileService = new FileService($storage);
        $albumService = new AlbumService($fileService);
        $vietnam = 'Việt Nam';
        $usuk = 'Âu Mỹ';

        $vietnamSongs = $albumService->getSongsByGenreName($vietnam);
        $usukSongs = $albumService->getSongsByGenreName($usuk);
        $asiaSongs = $albumService->getSongsOfAsia(); 

        $asiaSongs->map(function ($item) use ($albumService) {
            return $albumService->updateTop100($item, 1);
        });

        $vietnamSongs->map(function ($item) use ($albumService) {
            return $albumService->updateTop100($item, 1);
        });

        $usukSongs->map(function ($item) use ($albumService) {
            return $albumService->updateTop100($item, 1);
        });
    }
}
