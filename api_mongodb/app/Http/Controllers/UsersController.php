<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;

class UsersController extends Controller
{
    public function store(Request $request)
    {
        $this->validate($request, [
            'name'=>'required',
            'email'=>'required|email|regex:/(.*@.{2,}\..{2,3})$/|unique:users',
            'password'=>'required',
        ]);

        $user = new User();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=Hash::make($request->password);
        $user->save();

        return response()->json(["msg"=>"Usuario creado correctamente"],200);
    }

    public static function getUserIdFromToken() {
        try {
            $user=auth()->user();
        } catch (JWTException $e) {
            return response()->json(['msg' => 'Invalid token']);
        }
        return response()->json(['id' => $user]);
    }
}
