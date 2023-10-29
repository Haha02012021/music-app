<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Genre extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'admin_id',
    ];

    public function songs() {
        return $this->hasMany(Song::class);
    }

    public function account() {
        return $this->belongsTo(Account::class, 'admin_id');
    }
}
