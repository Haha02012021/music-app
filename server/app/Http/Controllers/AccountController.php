<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Models\Account;
use App\Models\Singer;

class AccountController extends Controller
{
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
}
