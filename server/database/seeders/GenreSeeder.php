<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('genres')->truncate();
        DB::table('genres')->insert(
            array(
                array('title' => 'Trữ Tình & Bolero', 'name' => 'Trữ Tình & Bolero', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Dance/Electronic', 'name' => 'Dance/Electronic', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Remix', 'name' => 'Remix', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Hip-hop', 'name' => 'Hip-hop', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'R&B', 'name' => 'R&B', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Phim', 'name' => 'Nhạc Phim', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Thiếu Nhi', 'name' => 'Nhạc Thiếu Nhi', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Không Lời', 'name' => 'Nhạc Không Lời', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Jazz', 'name' => 'Jazz', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Trịnh', 'name' => 'Nhạc Trịnh', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Rock', 'name' => 'Rock', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Indie', 'name' => 'Indie', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Latin', 'name' => 'Latin', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Acoustic', 'name' => 'Acoustic', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Việt Bất Hủ', 'name' => 'Nhạc Việt Bất Hủ', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Cổ Điển', 'name' => 'Nhạc Cổ Điển', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('title' => 'Nhạc Âu Mỹ Bất Hủ', 'name' => 'Nhạc Âu Mỹ Bất Hủ', 'admin_id' => 1, 'created_at' => '2023-9-27 19:52:59', 'updated_at' => '2023-9-27 19:52:59'), 
                array('name' => 'Việt Nam', 'title' => 'Việt Nam', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Rap Việt', 'title' => 'Rap Việt', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'V-Pop', 'title' => 'V-Pop', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'R&B Việt', 'title' => 'R&B Việt', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Hàn Quốc', 'title' => 'Hàn Quốc', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Pop/Pop Ballad', 'title' => 'Pop/Pop Ballad', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Dance Pop', 'title' => 'Dance Pop', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Âu Mỹ', 'title' => 'Âu Mỹ', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Pop', 'title' => 'Pop', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Rap / Hip Hop', 'title' => 'Rap / Hip Hop', 'admin_id' => 1, 'created_at' => '2023-10-28 20:44:37', 'updated_at' => '2023-10-28 20:44:37'), 
                array('name' => 'Hoa Ngữ', 'title' => 'Hoa Ngữ', 'admin_id' => 1, 'created_at' => '2023-11-20 22:14:27', 'updated_at' => '2023-11-20 22:14:27'), 
                array('name' => 'Trung Quốc', 'title' => 'Trung Quốc', 'admin_id' => 1, 'created_at' => '2023-11-20 22:14:27', 'updated_at' => '2023-11-20 22:14:27'),
                array('name' => 'Nhật Bản', 'title' => 'Nhật Bản', 'admin_id' => 1, 'created_at' => '2023-11-20 22:14:27', 'updated_at' => '2023-11-20 22:14:27'),
                array('name' => 'EDM Việt', 'title' => 'EDM Việt', 'admin_id' => 1, 'created_at' => '2023-11-20 22:14:27', 'updated_at' => '2023-11-20 22:14:27'),
            )
        );
    }
}
