<?php

namespace App\Http\Middleware;

use App\Enums\Role;
use App\Models\AccessToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRoleIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        $account = AccessToken::where('access_token', $token)->first()->account;        
        $isAdmin = $account->role === Role::ADMIN;
        return $isAdmin ? $next($request) : response()->json([
          'success' => false,
          'message' => 'Bạn không có quyền thực hiện tác vụ này!',
        ], 403);
    }
}
