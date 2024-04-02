<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TokenValidator
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
        $token=$request->header('Authorization');
        if(!$token)
            return response()->json(['msg'=>'No se ha enviado el token'],401);
        try{
            JWTAuth::parseToken($token)->authenticate();
        }
        catch (\Exception $e){
            return response()->json(['msg'=>'Token invalido'],404);
        }
        return $next($request);
    }
}
