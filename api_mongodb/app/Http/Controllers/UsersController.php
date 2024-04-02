<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Mail\ConfirmarEmail;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\URL;

class UsersController extends Controller
{
    public function store(Request $request)
    {
        $validate=Validator::make($request->all(), [
            'name'=>'required',
            'email'=>'required|email|regex:/(.*@.{2,}\..{2,3})$/|unique:users',
            'password'=>'required|min:8',
        ]);

        if($validate->fails()){
            return response()->json(["error" => $validate->errors()], 422);
        }


        $user = new User();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=Hash::make($request->password);
        $user->save();

        $token = JWTAuth::fromUser($user);
        $url = URL::temporarySignedRoute(
            'activate',
            now()->addMinutes(10),
            ['token' => $token]
        );
        Mail::to($request->email)->send(new ConfirmarEmail($url, $user->name));
        return response()->json(["msg"=>"Usuario creado correctamente"],200);
    }


    public function activate($token)
    {
        $url = URL::to('activate',[$token]) ;
        try {
            JWTAuth::parseToken($token)->authenticate();
        } catch (JWTException $e) {
            return response()->view('ErrorEmail', ['reenviar_email' => $url]);
        }
        $user = User::find($this->getIDbyToken($token));
        if (!$user)
            return response()->view('ErrorEmail', ['reenviar_email' => $url]);
        $user->status = true;
        $user->save();
        return response()->view('AcceptedEmail');
    }

    public function me(Request $request)
    {
        $user = auth()->user();
        return response()->json($user, 200);
    }

    public function getIDbyToken($token)
    {
        $payload = JWTAuth::parseToken($token);
        return $payload->getPayload()['sub'];
    }
}
