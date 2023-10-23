<?php

namespace App\Services;

use App\Models\Account;

class AuthenticateService {
    public function getZaloUser($accessToken)
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
        $account = Account::where('uid', $user->id)->select('id', 'username', 'avatar')->first();
        if (!$account) {
            $newAccount = [
                'uid' => $user->id,
                'username' => $user->name,
                'avatar' => $user->picture->data->url,
            ];
            $account = $newAccount;
            Account::create($newAccount);
        }
        return $account;
    }
}