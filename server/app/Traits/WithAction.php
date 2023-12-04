<?php
namespace App\Traits;

use App\Enums\ActionType;

trait WithAction
{
    public function scopeWithLiked($query, $authId, $relation = 'actions', $alias = 'is_liked')
    {
        $query->withExists([
            $relation.' as is_liked' => function ($query) use ($authId) {
                return $query->where('type', ActionType::LIKE)
                            ->where('account_id', $authId);
            }
        ]);
        
        return $query;
    }
}