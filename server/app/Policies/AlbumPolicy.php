<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\Album;
use Illuminate\Auth\Access\Response;

class AlbumPolicy
{
    /**
     * Determine whether the account can update album.
     */
    public function update(Account $account, Album $album): bool
    {
        return $account->id === $album->account_id;
    }
}
