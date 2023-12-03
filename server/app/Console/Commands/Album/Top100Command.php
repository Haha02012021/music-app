<?php

namespace App\Console\Commands\Album;

use App\Services\AlbumService;
use Illuminate\Console\Command;

class Top100Command extends Command
{
    protected AlbumService $albumService;

    public function __construct(AlbumService $albumService) {
        $this->albumService = $albumService;
    }
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:top100-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $vietnam = 'Việt Nam';
        $usuk = 'Âu Mỹ';

        $vietnamSongs = $this->albumService->getSongsByGenreName($vietnam);
        $usukSongs = $this->albumService->getSongsByGenreName($usuk);
        $asiaSongs = $this->albumService->getSongsOfAsia(); 

        $asiaSongs->map(function ($item) {
            return $this->albumService->updateTop100($item, 1);
        });

        $vietnamSongs->map(function ($item) {
            return $this->albumService->updateTop100($item, 1);
        });

        $usukSongs->map(function ($item) {
            return $this->albumService->updateTop100($item, 1);
        });
    }
}
