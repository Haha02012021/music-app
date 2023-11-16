<?php

namespace App\Services;

use App\Models\AccessToken;
use App\Models\Account;

class AuthenticateService 
{
    public function getCurrentUser($accessToken, $refreshToken = '', $expiresIn = 0)
    {
        $userCurl = curl_init();
        $userParams = '?fields=id,name,picture';
        $userUrl = 'https://graph.zalo.me/v2.0/me'.$userParams;
        $userHeader = [
            'access_token:'.$accessToken,
        ];
        curl_setopt_array($userCurl, array(
            CURLOPT_URL => $userUrl,
            CURLOPT_RETURNTRANSFER => true, 
            CURLOPT_TIMEOUT => 0,   
        ));
        curl_setopt($userCurl, CURLOPT_HTTPHEADER, $userHeader);
        $userRes = curl_exec($userCurl);
        $user = json_decode($userRes);
        $account = null;
        if ($user->error === 452) {
            $existsToken = AccessToken::where('access_token', $accessToken)->first();
            $account = Account::find($existsToken->account_id)->select('id', 'username', 'avatar')->first();
            $newToken = $this->getAccessTokenAgain($existsToken->refresh_token);
            $expiresIn = $newToken->expires_in;
            $accessToken = $newToken->access_token;
            $refreshToken = $newToken->refresh_token;
            $existsToken->delete();
        } else {
            $account = Account::where('uid', $user->id)->select('id', 'username', 'avatar')->first();
        }
        
        if (!$account) {
            $newAccount = [
                'uid' => $user->id,
                'username' => $user->name,
                'avatar' => $user->picture->data->url,
            ];
            $createdAccount = Account::create($newAccount);
            $account = [
                'id' => $createdAccount->id,
                'username' => $createdAccount->username,
                'avatar' => $createdAccount->avatar,
            ];
        }

        if ($expiresIn) {
            $newAccessToken = [
                'account_id' => $account['id'],
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'expires_in' => $expiresIn,
            ];
            AccessToken::create($newAccessToken);
        }
        return $account;
    }

    public function getAccessToken($payload)
    {
        $accessTokenCurl = curl_init();
        $accessTokenUrl = 'https://oauth.zaloapp.com/v4/access_token';
        $accessTokenHeader = array(
            'Content-Type:application/x-www-form-urlencoded',
            'secret_key:'.env('ZALO_CLIENT_SECRET')
        );
        curl_setopt_array($accessTokenCurl, array(
            CURLOPT_URL => $accessTokenUrl,
            CURLOPT_RETURNTRANSFER => true, 
            CURLOPT_TIMEOUT => 0,   
            CURLOPT_POST => true,   
            CURLOPT_POSTFIELDS => http_build_query($payload) 
        ));
        curl_setopt($accessTokenCurl, CURLOPT_HTTPHEADER, $accessTokenHeader);
        $tokensRes = curl_exec($accessTokenCurl);
        $tokens = json_decode($tokensRes);
        curl_close($accessTokenCurl);

        return $tokens;
    }

    public function getAccessTokenAgain($refreshToken)
    {
        $payload = [
            'refresh_token' => $refreshToken,
            'app_id' => env('ZALO_CLIENT_ID'),
            'grant_type' => 'refresh_token',
        ];

        return $this->getAccessToken($payload);
    }
}