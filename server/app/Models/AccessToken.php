<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccessToken extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'account_id',
        'access_token',
        'refresh_token',
        'expires_in',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
