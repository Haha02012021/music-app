<?php

namespace App\Console\Commands\Album;

use App\Jobs\Album\UpdateTop100;
use Illuminate\Console\Command;

class Top100Command extends Command
{
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
        $updateJob = new UpdateTop100();
        dispatch($updateJob);
    }
}
