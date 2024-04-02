<?php

namespace App\Http\Controllers;

use App\Models\Paquete;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaquetesController extends Controller
{
    public function index(Request $request)
    {
        $paquetes = Paquete::where('user_id', AuthController::getIDbyToken($request->header('Authorization')))->get();
        return response()->json($paquetes);
    }

    public function store(Request $request)
    {
        $validaciones= Validator::make($request->all(),[
            'nombre'=>'required|regex:/^[\pL\s\d]+$/u|max:20',
            'lugar'=>'required|regex:/^[\pL\s\d]+$/u|max:20'
        ]);

        if($validaciones->fails()){
            return response()->json(["Errores"=>$validaciones->errors(),"msg"=>"Error en los datos"],400);
        }
        $lastPackage= Paquete::where('user_id', AuthController::getIDbyToken($request->header('Authorization')))->latest('fecha_de_creacion')->first();
        if($lastPackage!==null)
        {
            Log::info($lastPackage);
            $id= (int)$lastPackage->esp_id;
            $id++;
            Log::info($id);
            $esp_id= '0'.$id;
            Log::info($esp_id);
        }
        else
        {
            $esp_id= '01';
        }

        try {
            $paquete = new Paquete();
            $paquete->user_id = AuthController::getIDbyToken($request->header('Authorization'));
            $paquete->nombre = $request->nombre;
            $paquete->lugar = $request->lugar;
            $paquete->fecha_de_creacion = Carbon::now('America/Monterrey')->toDateTimeString();
            $paquete->esp_id = $esp_id;
            $paquete->save();
        }
        catch (\Exception $e){
            return response()->json(["msg"=>"Error al guardar el paquete"],400);
        }
        return response()->json($paquete);
    }
}
