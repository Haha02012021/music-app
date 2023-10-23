<?php

namespace App\Http\Middleware;

use App\Models\AccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenIsValid
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $hasToken = AccessToken::where('access_token', $token)->first();
        return $hasToken ? $next($request) : response()->json([
            'success' => false,
            'message' => 'Hãy đăng nhập để thực hiện thao tác này!'
        ]);
    }
}
