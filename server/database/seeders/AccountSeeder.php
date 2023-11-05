<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('accounts')->truncate();
        DB::table('accounts')->insert([
            'uid' => '5258193987502002572',
            'username' => 'Đào Thu Hằng',
            'role' => 2,
            'avatar' => 'https://s120-ava-talk.zadn.vn/9/6/2/0/2/120/ee95e215ecffddc91ee265255368c290.jpg',
        ]);
    }
}
