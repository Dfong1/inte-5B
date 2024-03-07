<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        $users=User::all();
        return response()->json(['users'=>$users,'HolaMundo'=>'Hola Mundo']);
    }
    public function store(Request $request)
    {
        $user=new User();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=$request->password;
        $user->save();
        return response()->json(['user'=>$user]);
    }
}
