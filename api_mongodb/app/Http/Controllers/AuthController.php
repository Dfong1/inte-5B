<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use \Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function login(Request $request)
    {
        $validaciones = Validator::make($request->all(),[
            'email'=>'required|email|regex:/(.*@.{2,}\..{2,3})$/',
            'password'=>'required|string|max:255'
        ]);
        if($validaciones->fails()){
            return response()->json(["Errores"=>$validaciones->errors(),"msg"=>"Error en los datos"],400);
        }
        $user=User::where('email',$request->email)->first();
        if(!$user){
            return response()->json(['msg'=>'El usuario no existe'],404);
        }
        if($user->status==0){
            return response()->json(['msg'=>'El usuario no ha verificado su correo'],400);
        }
        $credentials = $request->only('email', 'password');
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['msg' => 'credenciales invalidas'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['msg' => 'no se pudo crear el token'], 500);
        }
        return response()->json(['token'=>$token,
            'msg'=>'Inicio de sesion correcto'],202);
    }
    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (JWTException $e) {
            return response()->json(['msg' => 'Algo salio mal'], 500);
        }
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public static function getIDbyToken($token)
    {
        try {
            $payload = JWTAuth::parseToken($token);
            return $payload->getPayload()['sub'];
        } catch (JWTException $e) {
            return null;
        }
    }

}
