<?php

namespace App\Services;

use App\Enums\ActionType;
use App\Enums\AlbumType;
use App\Models\Album;
use App\Models\Song;

class AlbumService 
{
    protected FileService $fileService;

    public function __construct(FileService $fileService) {
        $this->fileService = $fileService;
    }

    public function updateSingersSongs($songIds, $album, $authId) {
        if ($songIds) {
            $songIds = collect($songIds);
            $addSongIds = $songIds->filter(function (int $value) {
                return $value > 0;
            });
            $removeSongIds = $songIds->map(function (int $value) {
                if ($value < 0) {
                    return - $value;
                }
            });
            $currentSongIds = $album->songs($authId)->select('songs.id')->get()->pluck('id');
            $newSongIds = $currentSongIds->merge(collect($addSongIds))->unique()->diff($removeSongIds);
            $album->songs($authId)->detach();
            $album->singers()->detach();
            $songs = Song::with('singers')->whereIn('id', $newSongIds)->get();
            $singerIds = $songs->pluck('singers')->flatten(1)->values()->pluck('id')->unique()->toArray();
            $album->songs($authId)->attach($newSongIds);
            $album->singers()->attach($singerIds);
        }
    }

    public function removeSingersSongs() {

    }

    public function updateThumbnail($request, $name) {
        $t = [];
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailData = $this->fileService->uploadFile($thumbnail, THUMBNAILS_DIR, $name);
            $t['thumbnail'] = $thumbnailData['fileName'];
        }

        return $t;
    }

    public function getSongsByGenreName($genreName) {
        $songs = Song::whereRelation('genres', 'name', $genreName)
                    ->withCount(['actions' => function ($query) {
                        $first_date = date('Y-m-d',strtotime('first day of this month'));
                        $last_date = date('Y-m-d',strtotime('last day of this month'));
                        $query->whereBetween('actions.created_at', [$first_date, $last_date]);
                    }])
                    ->with('genres')
                    ->orderByDesc('released_at')
                    ->get()
                    ->sortByDesc('actions_count')
                    ->flatten(1)
                    ->groupBy(function ($song) use ($genreName) {
                        $genres = $song['genres'];
                        if (count($genres) > 1) {
                            foreach ($genres as $genre) {
                                if (strcmp($genreName, $genre['name']) !== 0) {
                                    return $genre['name'];
                                }
                            }
                        } else {
                            return 'Nhạc Trẻ';
                        }
                    })
                    ->map(function ($songs, $title) use ($genreName) {
                        $album = [];
                        $album['song_ids'] = $songs->pluck('id');
                        $album['title'] = 'Top 100 Nhạc '.$title.' hay nhất';
                        $album['account_id'] = 1;
                        $album['type'] = AlbumType::TOP100.'-'.$genreName;
                        $album['thumbnail'] = $songs[0]['thumbnail'];
                        $album['description'] = 'Top 100 '.$title.' là danh sách 100 ca khúc hot nhất hiện tại của thể loại '.$title.', được App tự động tổng hợp dựa trên thông tin số liệu lượt nghe và lượt yêu thích của từng bài hát. Dữ liệu sẽ được lấy trong 30 ngày gần nhất và được cập nhật liên tục.';
                        return $album;
                    })
                    ->values();
        return $songs;    
    }

    public function getSongsOfAsia() {
        $countries = ['Hàn Quốc', 'Hoa Ngữ', 'Nhật Bản'];
        $filmMusic = 'Nhạc Phim';
        $songs = Song::whereRelation('genres', function ($query) use ($countries) {
                        $query->whereIn('name', $countries);
                    })
                    ->withCount(['actions' => function ($query) {
                        $first_date = date('Y-m-d',strtotime('first day of this month'));
                        $last_date = date('Y-m-d',strtotime('last day of this month'));
                        $query->whereBetween('actions.created_at', [$first_date, $last_date]);
                    }])
                    ->with('genres')
                    ->orderByDesc('released_at')
                    ->get()
                    ->sortByDesc('actions_count')
                    ->flatten(1)
                    ->groupBy(function ($song) use ($countries, $filmMusic) {
                        $genres = $song['genres'];
                        $title = "";
                        foreach ($genres as $genre) {
                            if (in_array($genre['name'], $countries)) {
                                $title .= $genre['name'];
                            } else if (strcmp($genre['name'], $filmMusic) === 0) {
                                $title = $filmMusic.' '.$title;
                            }
                        }
                        return $title;
                    })
                    ->map(function ($songs, $genreName) {
                        $album = [];
                        $album['song_ids'] = $songs->pluck('id');
                        $album['title'] = 'Top 100 Nhạc '.$genreName.' hay nhất';
                        $album['account_id'] = 1;
                        $album['type'] = AlbumType::TOP100.'-Châu Á';
                        $album['thumbnail'] = $songs[0]['thumbnail'];
                        $album['description'] = 'Top 100 '.$genreName.' là danh sách 100 ca khúc hot nhất hiện tại của thể loại '.$genreName.', được App tự động tổng hợp dựa trên thông tin số liệu lượt nghe và lượt yêu thích của từng bài hát. Dữ liệu sẽ được lấy trong 30 ngày gần nhất và được cập nhật liên tục.';
                        return $album;
                    })
                    ->values();
        return $songs;    
    }

    public function createTop100($item, $authId) {
        $songIds = $item['song_ids'];
        unset($item['song_ids']);
        $album = Album::create($item);
        $this->updateSingersSongs($songIds, $album, $authId);
        $album->singers;
        $album->is_liked = $album->where('account_id', $authId)
                                ->where('type', ActionType::LIKE)
                                ->exists();

        return $album;
    }

    public function updateTop100($item, $authId) {
        $songIds = $item['song_ids'];
        unset($item['song_ids']);
        $album = Album::where('title', $item['title'])->with('singers')->first();
        if (!$album) {
            $album = Album::create($item);
            $album->singers;
            $album->is_liked = $album->where('account_id', $authId)
                                    ->where('type', ActionType::LIKE)
                                    ->exists();
        }
        $this->updateSingersSongs($songIds, $album, $authId);

        return $album;
    }

    public function getOutstandingAlbums($authId) {
        $firstDateOfMonth = date('Y-m-d',strtotime('first day of this month'));
        $lastDateOfMonth = date('Y-m-d',strtotime('last day of this month'));

        $outstandingAlbums = Album::where('type', 'like', AlbumType::TOP100.'%')
                                    ->with('singers')
                                    ->withCount(['actions' => function ($query) use ($firstDateOfMonth, $lastDateOfMonth) {
                                        $query->whereBetween('actions.created_at', [$firstDateOfMonth, $lastDateOfMonth]);
                                    }])
                                    ->orderByDesc('released_at')
                                    ->get()
                                    ->map(function ($album) use ($authId) {
                                        $songs = $album->songs($authId)->get();
                                        $album->songs_count = $songs->count();
                                        $album->songs_actions_count = $songs->sum('actions_count');
                                        return $album;
                                    })
                                    ->sortByDesc(function ($album) {
                                        if ($album->songs_count !== 0)
                                            return ($album['songs_actions_count'] + $album['actions_count']) / $album->songs_count;
                                        return 0;
                                    })
                                    ->take(4)
                                    ->flatten(1);

        return $outstandingAlbums;
    }
}