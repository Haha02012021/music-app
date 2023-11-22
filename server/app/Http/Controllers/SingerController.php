<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Http\Requests\Singer\SingerCreateRequest;
use App\Http\Requests\Singer\SingerUpdateRequest;
use App\Models\Singer;
use App\Services\FileService;
use App\Services\SingerService;

class SingerController extends Controller
{
    protected FileService $fileService;
    protected SingerService $singerService;

    public function __construct(FileService $fileService, SingerService $singerService) {
        $this->fileService = $fileService;
        $this->singerService = $singerService;
    }

    public function getAllSingers(CustomRequest $request) {
        $limit = $request->limit;
        if (!$limit) {
            $limit = PAGE_LENGTH;
        }

        $singers = Singer::select([
                        'id',
                        'name',
                        'thumbnail',
                        'updated_at',
                    ])
                    ->paginate($limit);
        collect($singers->items())->map(function ($singer) {
            if (!str_contains($singer->thumbnail, 'https')) {
                $singer->thumbnail = $this->fileService->getFileUrl($singer->thumbnail, THUMBNAILS_DIR);
            };

            return $singer;
        });

        return response()->json([
            'success' => true,
            'data' => $singers,
        ]);
    }

    public function create(SingerCreateRequest $request) {
        $data = $request->except('thumbnail');
        
        $thumbnail = $this->singerService->updateThumbnail($request, $request->input('name'));
        if ($thumbnail) {
            $data['thumbnail'] = $thumbnail;
        }

        Singer::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Tạo ca sĩ thành công!',
        ]);
    }

    public function update(SingerUpdateRequest $request) {
        $singer = Singer::find($request->input('id'));
        
        $data = $request->except(['thumbnail', 'id']);

        $thumbnail = $this->singerService->updateThumbnail($request, $singer->name);
        if ($thumbnail) {
            $data['thumbnail'] = $thumbnail;
        }

        $singer->update($data);
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nghệ sĩ thành công!',
        ]);
    }

    public function getSingerById(CustomRequest $request) {
        $authAccount = $request->authAccount();
        $authId = $authAccount ? $authAccount->id : null;

        $id = $request->id;
        $singer = Singer::withCount('followers')
                        ->withExists('followers as is_followed', function ($query) use ($authId) {
                            if ($authId) {
                                $query->where('follower_id', $authId);
                            }
                        })
                        ->find($id);
                        
        $limit = $request->limit;
        if (!$limit) {
            $limit = SLICE_LENGTH;
        }
        $singer->songs_slice = $singer->songs()->get()->take($limit);
        $singer->albums_slice = $singer->albums()->get()->take($limit);
        $singer->thumbnail = str_contains($singer->thumbnail, 'https') ? $singer->thumbnail : $this->fileService->getFileUrl($singer->thumbnail, THUMBNAILS_DIR);

        return response()->json([
            'success' => true,
            'data' => $singer,
        ]);
    }

    public function delete(int $id) {
        $singer = Singer::find($id);
        if ($singer) {
            $singer->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa ca sĩ thành công!',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Không tồn tại singer id!',
        ]);
    }

    public function getTopSingers() {
        $singers = Singer::with([
                                'songs' => function ($query) {
                                    $query->withCount('actions')
                                        ->orderByDesc('released_at');
                                },
                            ])
                        ->withCount('followers')
                        ->get()
                        ->map(function ($singer) {
                            $singer->songs_actions_count = $singer->songs->sum('actions_count');
                            $singer->songs->sortByDesc('actions_count');
                            return $singer;
                        })
                        ->sortByDesc('followers_count')
                        ->sortByDesc(function ($singer) {
                            if (count($singer->songs))
                                return $singer['songs_actions_count'] / count($singer->songs);
                            return 0;
                        })
                        ->take(5)
                        ->map(function ($singer) {
                            if (!str_contains($singer->thumbnail, 'https')) {
                                $singer->thumbnail = $this->fileService->getFileUrl($singer->thumbnail, THUMBNAILS_DIR);
                            }
                            return $singer;
                        })
                        ->flatten(1);

        return response()->json([
            'success' => true,
            'data' => $singers,
        ]);
    }
}
