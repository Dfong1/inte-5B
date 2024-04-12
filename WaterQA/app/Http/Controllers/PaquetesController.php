<?php

namespace App\Http\Controllers;

use App\Events\PaqueteEvent;
use App\Models\Paquete;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaquetesController extends Controller
{
    public function index(Request $request)
    {
        $paquetes = Paquete::where('user_id', AuthController::getIDbyToken($request->header('Authorization')))->where('status', '1') ->get();
        return response()->json($paquetes);
    }

    public function store(Request $request)
    {
        $validaciones= Validator::make($request->all(),[
            'nombre'=>'required|nullable|regex:/^[\pL\s\d]+$/u|max:20',
            'lugar'=>'required|nullable|regex:/^[\pL\s\d]+$/u|max:20'
        ]);

        if($validaciones->fails()){
            return response()->json(["errores"=>$validaciones->errors(),"msg"=>"Error en los datos"],400);
        }
        $lastPackage= Paquete::where('user_id', AuthController::getIDbyToken($request->header('Authorization')))->latest('fecha_de_creacion')->first();
        if($lastPackage!==null)
        {
            $id= (int)$lastPackage->esp_id;
            $id++;
            $esp_id= '0'.$id;
            if(strlen($esp_id) > 2)
            {
                $split = substr($esp_id, 1);
                Log::info($split);
                $esp_id = $split;
                //TODO: limite 99 paquetes por usuario
                if($esp_id==='99')
                    return response()->json(["msg"=>"No se pueden crear más paquetes"],400);
            }
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

    public function cambiarLed($id)
    {
        $paquete = Paquete::find($id);
        $paquete->led = !$paquete->led;
        $paquete->save();
        $led= $paquete->led ? 1 : "0";
        event(new PaqueteEvent($led));
    }

    public function update(Request $request,$id)
    {
        $paquete = Paquete::find($id);
        if (!$paquete) return response()->json(['msg' => 'No se encontró el paquete'], 404);
        $validations = Validator::make($request->all(), [
            'nombre' => 'sometimes|regex:/^[\pL\s\d]+$/u |max:20',
            'lugar' => 'sometimes|regex:/^[\pL\s\d]+$/u |max:20'
        ]);

        if ($validations->fails()) {
            return response()->json(["errores" => $validations->errors(), "msg" => "Error en los datos"], 400);
        }
        Log::info($request->nombre);
        if($request->has('nombre')) $paquete->nombre = $request->nombre;
        if($request->has('lugar')) $paquete->lugar = $request->lugar;
        $paquete->save();
        return response()->json(['data'=>$paquete,'msg'=>'Paquete actualizado correctamente'],200);
    }

    public function destroy($id)
    {
        $paquete = Paquete::find($id);
        if (!$paquete) return response()->json(['msg' => 'No se encontró el paquete'], 404);
        $status = $paquete->status;
        $paquete->status=!$status;
        $paquete->save();
        return response()->json(['msg' => 'Estado cambiado','data'=>$paquete], 200);
    }

    public function show($id){
        $paquete = Paquete::find($id);

        if(!$paquete){
            return response()->json(['msg' => 'Paquete no encontrado'], 404);
        }

        return response()->json($paquete);
    }
}
