<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
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

    public function accessToken()
    {
        return $this->hasOne(AccessToken::class);
    }

    public function account() {
        return $this->hasOne(Album::class);
    }

    public function genres() {
        return $this->hasMany(Genre::class, 'admin_id');
    }

    public function song() {
        return $this->hasOne(Song::class);
    }
}
