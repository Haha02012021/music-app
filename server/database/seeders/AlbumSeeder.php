<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlbumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('albums')->truncate();
        DB::table('albums')->insert([
            [
                "title" => "Dấu Chân Kỷ Niệm",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2023-1-17",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Twelve Carat Toothache",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-6-3",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "GOD DID",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-8-26",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "I NEVER LIKED YOU",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-4-29",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Scarlet",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2023-9-22",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Marry Me (Original Motion Picture Soundtrack)",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-2-4",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "RESPECT (Original Motion Picture Soundtrack)",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2021-8-13",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Top Gun: Maverick (Music From The Motion Picture)",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-5-27",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Vehicle Fun with CoComelon",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-9-16",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Pinkfong Presents: The Best of Baby Shark",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2018-11-30",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Love For Sale (Deluxe)",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2021-10-1",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "The Metallica Blacklist",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2021-9-10",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "mainstream sellout",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-3-25",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "De Adentro Pa Afuera",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-9-6",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "AGUILERA",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-9-27",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "MAÑANA SERÁ BONITO",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2023-2-24",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ],
            [
                "title" => "Un Verano Sin Ti",
                "account_id" => 1,
                "type" => 1,
                "released_at" => "2022-5-6",
                "created_at" => "2023-10-27 20:21:38",
                "updated_at" => "2023-10-27 20:21:38"
            ]
        ]);
    }
}
