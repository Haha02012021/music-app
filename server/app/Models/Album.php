<?php

namespace App\Models;

use App\Enums\ActionItem;
use App\Enums\ActionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'account_id',
        'type',
        'released_at',
        'thumbnail',
        'description',
    ];

    public function author() {
        return $this->belongsTo(Account::class, 'account_id', 'id');
    }

    public function singers() {
        return $this->belongsToMany(Singer::class, 'singers_albums', 'album_id', 'singer_id')
                    ->select(['singers.id', 'name']);
    }

    public function actions() {
        return $this->belongsToMany(Account::class, 'actions', 'item_id', 'account_id')
                    ->wherePivot('item', ActionItem::ALBUM)
                    ->withPivot(['type', 'item'])
                    ->withTimestamps();
    }

    public function songs($authId) {
        return $this->belongsToMany(Song::class, 'albums_songs', 'album_id', 'song_id')
                    ->with('singers')
                    ->select(['songs.id', 'name', 'duration'])
                    ->withExists('actions as is_liked', function ($query) use ($authId) {
                        $query->where('account_id', $authId)
                                ->where('type', ActionType::LIKE);
                    });
    }
}
