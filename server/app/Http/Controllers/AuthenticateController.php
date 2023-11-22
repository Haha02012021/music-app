<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomRequest;
use App\Models\AccessToken;
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
        $payload = [
            'code' => $code,
            'app_id' => env('ZALO_CLIENT_ID'),
            'grant_type' => 'authorization_code',
        ];
        $tokens = $this->authenticateService->getAccessToken($payload);
        
        $account = $this->authenticateService->getCurrentUser(
            $tokens->access_token, 
            $tokens->refresh_token, 
            $tokens->expires_in
        );
        return view('success-login', [
            'response' => [
                'success' => true,
                'data' => [
                    'user' => $account,
                    'tokens' => $tokens,
                ],
            ]
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

    public function logout(CustomRequest $request)
    {
        $accessToken = $request->bearerToken();
        $appId = env('ZALO_CLIENT_ID');
        $payload = [
            'access_token' => $accessToken,
            'app_id' => $appId,
        ];
        $logoutCurl = curl_init();
        $logoutUrl = 'https://id.zalo.me/account/logout?continue='.env('APP_URL');
        $logoutHeader = array(
            'Content-Type:application/x-www-form-urlencoded',
            'secret_key:'.env('ZALO_CLIENT_SECRET')
        );
        curl_setopt_array($logoutCurl, array(
            CURLOPT_URL => $logoutUrl,
            CURLOPT_RETURNTRANSFER => true, 
            CURLOPT_TIMEOUT => 3600,   
            CURLOPT_POST => true,   
            CURLOPT_POSTFIELDS => http_build_query($payload) 
        ));
        curl_setopt($logoutCurl, CURLOPT_HTTPHEADER, $logoutHeader);
        $logoutRes = curl_exec($logoutCurl);
        $logoutR = json_decode($logoutRes);
        curl_close($logoutCurl);

        return response()->json([
            'success' => true,
            'data' => $logoutR
        ]);
    }
}
