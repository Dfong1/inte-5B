<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Activar Cuenta</title>
    <style>
        .box {
            width: 300px;
            padding: 20px;
            margin: 0 auto;
            margin-top: 100px;
            border: 1px solid #ccc;
            border-radius: 5px;
            text-align: center;
        }
        .button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    </style>
</head>
<body>
<div class="box">
    <h2>Bienvenido {{$name}}</h2>
    <p>Click para activar cuenta</p>
    <a href="{{ $url }}" class="button">Activar</a>
</div>
</body>
</html>
