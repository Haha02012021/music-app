<?php

namespace App\Http\Controllers;

use App\Enums\ActionType;
use App\Http\Requests\CustomRequest;
use App\Models\Album;
use App\Models\Singer;
use App\Models\Song;
use App\Services\FileService;

class AccountController extends Controller
{
    private FileService $fileService;

    /**
     * Define constructors.
     * 
     * @param (\App\Services\FileService): $fileService
     */
    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function follow(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $singerId = $request->singerId;
        $singer = Singer::find($singerId);
        if ($singer) {
            $existsFollower = $authAccount->whereRelation('followedSingers', 'singer_id', $singerId)->first();
            if ($existsFollower) {
                $authAccount->followedSingers()->detach($singerId);

                return response()->json([
                    'success' => true,
                    'message' => 'Bỏ follow thành công!',
                ]);
            } else {
                $authAccount->followedSingers()->attach($singerId);

                return response()->json([
                    'success' => true,
                    'message' => 'Follow thành công!',
                ]);
            }
        }
    }

    public function search(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;
        $keyword = $request->keyword ?? '';
        $songs = Song::search($keyword)
                    ->withExists('actions as is_liked', function ($query) use ($authId) {
                        if ($authId) {
                            $query->where('account_id', $authId)
                                ->where('type', ActionType::LIKE);
                        }
                    })
                    ->get()
                    ->map(function ($song) {
                        if (!str_contains($song->thumbnail, 'https')) {
                            $song->thumbnail = $this->fileService->getFileUrl($song->thumbnail, THUMBNAILS_DIR);
                        }
                        return $song;
                    });
        $albums = Album::search($keyword)
                    ->withExists('actions as is_liked', function ($query) use ($authId) {
                        if ($authId) {
                            $query->where('account_id', $authId)
                                ->where('type', ActionType::LIKE);
                        }
                    })
                    ->get()
                    ->map(function ($album) {
                        if (!str_contains($album->thumbnail, 'https')) {
                            $album->thumbnail = $this->fileService->getFileUrl($album->thumbnail, THUMBNAILS_DIR);
                        }
                        return $album;
                    });
        $singers = Singer::where('name', 'like', '%'.$keyword.'%')
                    ->withExists('followers as is_followed', function ($query) use ($authId) {
                        if ($authId) {
                            $query->where('follower_id', $authId);
                        }
                    })
                    ->get()
                    ->map(function ($singer) {
                        if (!str_contains($singer->thumbnail, 'https')) {
                            $singer->thumbnail = $this->fileService->getFileUrl($singer->thumbnail, THUMBNAILS_DIR);
                        }
                        return $singer;
                    });
        if ($singers->count() === 0) {
            $singers = Singer::whereRelation('songs', 'name', 'like', '%'.$keyword.'%')
                            ->withExists('followers as is_followed', function ($query) use ($authId) {
                                if ($authId) {
                                    $query->where('follower_id', $authId);
                                }
                            })
                            ->get()
                            ->map(function ($singer) {
                                if (!str_contains($singer->thumbnail, 'https')) {
                                    $singer->thumbnail = $this->fileService->getFileUrl($singer->thumbnail, THUMBNAILS_DIR);
                                }
                                return $singer;
                            });
        }

        return response()->json([
            'success' => true,
            'data' => [
                'songs' => $songs,
                'albums' => $albums,
                'singers' => $singers,
            ],
        ]);
    }
}
