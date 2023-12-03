<?php

namespace App\Http\Requests;

use App\Models\AccessToken;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CustomRequest extends FormRequest
{
    public function authAccount()
    {
        $token = $this->bearerToken();
        if ($token) {
            $accessToken = AccessToken::where('access_token', $token)->first();
            if ($accessToken) {
                $account = $accessToken->account;
                return $account;
            } else {
                return null;
            }
        }
        return null;
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Validation errors',
            'data'      => $validator->errors()
        ], 400));
    }
}
