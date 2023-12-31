<?php

namespace App\Models;

use App\Enums\ActionItem;
use App\Enums\ActionType;
use App\Traits\FullTextSearch;
use App\Traits\WithAction;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use HasFactory;
    use SoftDeletes;
    use FullTextSearch;
    use WithAction;

    protected $fillable = [
        'title',
        'account_id',
        'type',
        'released_at',
        'thumbnail',
        'description',
    ];

    protected $searchable = ['title'];

    public function author() {
        return $this->belongsTo(Account::class, 'account_id', 'id');
    }

    public function singers() {
        return $this->belongsToMany(Singer::class, 'singers_albums', 'album_id', 'singer_id')
                    ->select(['singers.id', 'name', 'thumbnail']);
    }

    public function actions() {
        return $this->belongsToMany(Account::class, 'actions', 'item_id', 'account_id')
                    ->wherePivot('item', ActionItem::ALBUM)
                    ->withPivot(['type', 'item'])
                    ->withTimestamps();
    }

    public function songs(?int $authId = 0) {
        return $this->belongsToMany(Song::class, 'albums_songs', 'album_id', 'song_id')
                    ->with('singers')
                    ->select(['songs.id', 'name', 'duration', 'released_at', 'thumbnail'])
                    ->orderByDesc('released_at')
                    ->withCount('actions')
                    ->withLiked($authId);
    }
}
