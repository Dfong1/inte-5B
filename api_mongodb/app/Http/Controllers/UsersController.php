<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    public function store(Request $request)
    {
        $validations=Validator::make($request->all(),[
            'name'=>'required',
            'email'=>'required|email|regex:/(.*@.{2,}\..{2,3})$/|unique:users',
            'password'=>'required',
        ]);

        if($validations->fails()){
            return response()->json(["Errores"=>$validations->errors(),"msg"=>"Error en los datos"],400);
        }

        $user = new User();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=Hash::make($request->password);
        $user->save();

        return response()->json(["msg"=>"Usuario creado correctamente"],200);
    }
}
