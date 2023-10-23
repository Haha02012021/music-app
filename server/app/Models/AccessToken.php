<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'access_token',
        'expires_in',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
