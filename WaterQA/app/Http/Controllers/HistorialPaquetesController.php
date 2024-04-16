<?php

namespace App\Http\Controllers;

use App\Events\HistoryEvent;
use App\Models\HistorialPaquete;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HistorialPaquetesController extends Controller
{
    public function index($esp_id)
    {
        $historial = HistorialPaquete::where('paquete_id', $esp_id)->latest('fecha')->first();
        Log::info($historial);
        if(!$historial){
            return response()->json(['message' => 'No Hay datos registrados'],404);
        }
        $fecha = $historial->fecha;
        $dataarray=json_decode($historial,true);
        unset($dataarray['_id']);
        unset($dataarray['paquete_id']);
        unset($dataarray['fecha']);
        $propiedades = array_keys($dataarray);
        $valores = array_values($dataarray);
        $data=(object)['valores'=>$valores,'propiedades'=>$propiedades];
        $msg=(object)['fecha'=>$fecha,'data'=>$data];
        event(new HistoryEvent($msg));
    }

    public function show($id)
    {
        $historial = HistorialPaquete::where('paquete_id', $id)->latest('fecha')->first();
        Log::info($historial);
        if(!$historial){
            return response()->json(['message' => 'No Hay datos registrados'],400);
        }
        return response()->json(['data'=>$historial],200);
    }

    public function avarge_per_day(Request $request){
        $sensor = $request->sensor;
        $paquete_id = $request->paquete_id;
        $promedio = HistorialPaquete::promedioPorDiaSensor($sensor,$paquete_id);
        return response()->json(['data'=>$promedio],200);
    }




}
