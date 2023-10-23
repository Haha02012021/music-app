<?php

namespace App\Http\Controllers;

use App\Services\AuthenticateService;
use Illuminate\Http\Request;

class AuthenticateController extends Controller
{
    private AuthenticateService $authenticateService;

    /**
     * Define constructors.
     * 
     * @param (\App\Services\AuthenticateService): $authauthenticateService
     */
    public function __construct(AuthenticateService $authenticateService)
    {
        $this->authenticateService = $authenticateService;
    }

    public function loginSocial()
    {
        $appId = env('ZALO_CLIENT_ID');
        $callbackUri = env('ZALO_CLIENT_URI');
        $url = 'https://oauth.zaloapp.com/v4/permission?app_id='.$appId.'&redirect_uri='.$callbackUri.'&state=musicapp';

        return response()->json([
            'success' => true,
            'data' => $url,
            'message' => '',
        ]);
    }

    public function callbackSocial(Request $request)
    {
        $code = $request->query('code');
        $accessTokenCurl = curl_init();
        $accessTokenUrl = 'https://oauth.zaloapp.com/v4/access_token';
        $accessTokenHeader = array(
            'Content-Type:application/x-www-form-urlencoded',
            'secret_key:'.env('ZALO_CLIENT_SECRET')
        );
        $payload = [
            'code' => $code,
            'app_id' => env('ZALO_CLIENT_ID'),
            'grant_type' => 'authorization_code',
        ];
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
        
        $account = $this->authenticateService->getCurrentUser($tokens->access_token, $tokens->expires_in);
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $account,
                'tokens' => $tokens,
            ],
            'message' => 'Đăng nhập thành công!',
        ]);
    }

    public function getAuthUser(Request $request)
    {
        $accessToken = $request->bearerToken();
        $account = $this->authenticateService->getCurrentUser($accessToken);
        return response()->json([
            'success' => true,
            'data' => $account,
            'message' => 'Lấy thông tin người dùng thành công!',
        ]);
    }
}
