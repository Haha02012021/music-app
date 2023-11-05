<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Singer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bio',
    ];

    public function songs() {
        return $this->hasMany(Song::class);
    }

    public function albums() {
        return $this->hasMany(Album::class);
    }
}
