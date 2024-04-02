<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;

class StatusValidator
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user=User::find($this->getIDbyHeader($request->header('Authorization')));
        if($user->status===0)
            return response()->json(['msg'=>'El usuario no tiene acceso'],401);
        return $next($request);
    }

    public function getIDbyHeader($header)
    {
        $token=substr($header,7);
        $payload=JWTAuth::parseToken($token);
        return $payload->getPayload()['sub'];
    }
}
