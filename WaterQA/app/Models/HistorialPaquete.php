<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Jenssegers\Mongodb\Eloquent\Model;
use Jenssegers\Mongodb\Query\Builder as QueryBuilder;

class HistorialPaquete extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'historial_paquetes';
    public $timestamps = false;
    protected $guarded = [];

    public static function promedioPorDiaSensor($sensor,$paquete_id)
    {
        $sensorField='$'.$sensor;
        $aggregation = [
            [
                '$addFields' => [
                    'fecha_parsed' => ['$dateFromString' => ['dateString' => '$fecha']]
                ]
            ],
            [
                '$match' => [
                    'paquete_id' => $paquete_id
                ]
            ],
            [
                '$group' => [
                    '_id' => [
                        '$dateToString' => [
                            'format' => '%Y-%m-%d',
                            'date' => '$fecha_parsed'
                        ]
                    ],
                    'promedio' => ['$avg' => [
                        '$toDouble' => $sensorField
                        ]
                    ]
                ]
            ],
            [
                '$sort' => [
                    '_id' => -1
                ]
            ],
            [
                '$limit'=>20
            ]
        ];
        $result = self::raw(function($collection) use ($aggregation) {
            return $collection->aggregate($aggregation);
        });
        return $result;
    }
}
