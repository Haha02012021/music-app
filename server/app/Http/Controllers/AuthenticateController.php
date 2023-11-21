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
}
