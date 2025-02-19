<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colores = [
            ['name' => 'Blanco', 'codigo_hex' => '#FFFFFF'],
            ['name' => 'Negro', 'codigo_hex' => '#000000'],
            ['name' => 'Gris', 'codigo_hex' => '#808080'],
            ['name' => 'Rojo', 'codigo_hex' => '#FF0000'],
            ['name' => 'Azul', 'codigo_hex' => '#0000FF'],
            ['name' => 'Verde', 'codigo_hex' => '#00FF00'],
            ['name' => 'Amarillo', 'codigo_hex' => '#FFFF00'],
            ['name' => 'Cian', 'codigo_hex' => '#00FFFF'],
            ['name' => 'Magenta', 'codigo_hex' => '#FF00FF'],
            ['name' => 'Plateado', 'codigo_hex' => '#C0C0C0'],
            ['name' => 'Gris Claro', 'codigo_hex' => '#D3D3D3'],
            ['name' => 'Gris Oscuro', 'codigo_hex' => '#696969'],
            ['name' => 'Lima', 'codigo_hex' => '#00FF00'],
            ['name' => 'Oliva', 'codigo_hex' => '#808000'],
            ['name' => 'Marino', 'codigo_hex' => '#000080'],
            ['name' => 'Teal', 'codigo_hex' => '#008080'],
            ['name' => 'Índigo', 'codigo_hex' => '#4B0082'],
            ['name' => 'Violeta', 'codigo_hex' => '#EE82EE'],
            ['name' => 'Naranja', 'codigo_hex' => '#FFA500'],
            ['name' => 'Rosa', 'codigo_hex' => '#FFC0CB'],
            ['name' => 'Dorado', 'codigo_hex' => '#FFD700'],
            ['name' => 'Marrón', 'codigo_hex' => '#A52A2A'],
            ['name' => 'Beige', 'codigo_hex' => '#F5F5DC'],
            ['name' => 'Turquesa', 'codigo_hex' => '#40E0D0'],
            ['name' => 'Aguamarina', 'codigo_hex' => '#7FFFD4'],
            ['name' => 'Coral', 'codigo_hex' => '#FF7F50'],
            ['name' => 'Lavanda', 'codigo_hex' => '#E6E6FA'],
            ['name' => 'Esmeralda', 'codigo_hex' => '#50C878'],
            ['name' => 'Burdeos', 'codigo_hex' => '#800000'],
            ['name' => 'Caqui', 'codigo_hex' => '#F0E68C'],
            ['name' => 'Carmesí', 'codigo_hex' => '#DC143C'],
            ['name' => 'Chocolate', 'codigo_hex' => '#D2691E'],
            ['name' => 'Cerceta', 'codigo_hex' => '#008080'],
            ['name' => 'Mostaza', 'codigo_hex' => '#FFDB58'],
            ['name' => 'Pizarra', 'codigo_hex' => '#708090'],
            ['name' => 'Salmón', 'codigo_hex' => '#FA8072'],
            ['name' => 'Verde Oliva Oscuro', 'codigo_hex' => '#556B2F'],
            ['name' => 'Azul Acero', 'codigo_hex' => '#4682B4'],
            ['name' => 'Azul Medianoche', 'codigo_hex' => '#191970'],
            ['name' => 'Tomate', 'codigo_hex' => '#FF6347'],
            ['name' => 'Verde Bosque', 'codigo_hex' => '#228B22'],
            ['name' => 'Azul Real', 'codigo_hex' => '#4169E1'],
            ['name' => 'Rosa Caliente', 'codigo_hex' => '#FF69B4'],
            ['name' => 'Verde Mar', 'codigo_hex' => '#2E8B57'],
            ['name' => 'Orquídea', 'codigo_hex' => '#DA70D6'],
            ['name' => 'Lima Limón', 'codigo_hex' => '#32CD32'],
            ['name' => 'Magenta Oscuro', 'codigo_hex' => '#8B008B'],
            ['name' => 'Rojo Indio', 'codigo_hex' => '#CD5C5C'],
            ['name' => 'Verde Primavera', 'codigo_hex' => '#00FF7F'],
            ['name' => 'Azul Cielo', 'codigo_hex' => '#87CEEB'],
            ['name' => 'Rosa Palo', 'codigo_hex' => '#FFD1DC'],
            ['name' => 'Amarillo Maíz', 'codigo_hex' => '#FFF8DC'],
            ['name' => 'Azul Cobalto', 'codigo_hex' => '#0047AB'],
            ['name' => 'Siena', 'codigo_hex' => '#A0522D'],
        ];

        DB::table('colors')->insert($colores);
    }
}
