<?php

namespace App\Http\Controllers;

use App\Events\HistorialEvent;
use App\Models\HistorialPaquete;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HistorialPaquetesController extends Controller
{
    public function index($esp_id)
    {
        $historial = HistorialPaquete::where('paquete_id', $esp_id)->latest('fecha')->first();
        event(new HistorialEvent());
    }


}
