<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\ActionItem;
use App\Enums\ActionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Account extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uid',
        'username',
        'role',
        'avatar',
    ];

    public function accessTokens()
    {
        return $this->hasMany(AccessToken::class);
    }

    public function albums() {
        return $this->hasMany(Album::class);
    }

    public function genres() {
        return $this->hasMany(Genre::class, 'admin_id');
    }

    public function songs() {
        return $this->hasMany(Song::class);
    }

    public function actedSongs() {
        return $this->belongsToMany(Song::class, 'actions', 'account_id', 'item_id')
                    ->select([
                        'songs.id',
                        'songs.name',
                        'songs.thumbnail',
                        'songs.lyric',
                        'songs.duration',
                        'songs.audio',
                        'songs.released_at',
                        'songs.account_id',
                    ])
                    ->wherePivot('item', ActionItem::SONG)
                    ->orderByPivot('created_at', 'desc')
                    ->withPivot(['created_at as listened_at'])
                    ->withTimestamps();
    }

    public function actedAlbums() {
        return $this->belongsToMany(Album::class, 'actions', 'account_id', 'item_id')
                    ->select([
                        'albums.id',
                        'albums.title',
                        'albums.description',
                        'albums.thumbnail',
                        'albums.type',
                        'albums.released_at',
                        'albums.account_id',
                    ])
                    ->wherePivot('item', ActionItem::ALBUM)
                    ->orderByPivot('created_at', 'desc')
                    ->withPivot(['created_at as listened_at'])
                    ->withTimestamps();
    }

    public function followedSingers() {
        return $this->belongsToMany(Singer::class, 'singers_followers', 'follower_id', 'singer_id')
                    ->withTimestamps();
    }
}
