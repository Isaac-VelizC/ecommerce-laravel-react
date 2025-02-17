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
            ['nombre' => 'Blanco', 'codigo_hex' => '#FFFFFF'],
            ['nombre' => 'Negro', 'codigo_hex' => '#000000'],
            ['nombre' => 'Gris', 'codigo_hex' => '#808080'],
            ['nombre' => 'Rojo', 'codigo_hex' => '#FF0000'],
            ['nombre' => 'Azul', 'codigo_hex' => '#0000FF'],
            ['nombre' => 'Verde', 'codigo_hex' => '#00FF00'],
            ['nombre' => 'Amarillo', 'codigo_hex' => '#FFFF00'],
            ['nombre' => 'Cian', 'codigo_hex' => '#00FFFF'],
            ['nombre' => 'Magenta', 'codigo_hex' => '#FF00FF'],
            ['nombre' => 'Plateado', 'codigo_hex' => '#C0C0C0'],
            ['nombre' => 'Gris Claro', 'codigo_hex' => '#D3D3D3'],
            ['nombre' => 'Gris Oscuro', 'codigo_hex' => '#696969'],
            ['nombre' => 'Lima', 'codigo_hex' => '#00FF00'],
            ['nombre' => 'Oliva', 'codigo_hex' => '#808000'],
            ['nombre' => 'Marino', 'codigo_hex' => '#000080'],
            ['nombre' => 'Teal', 'codigo_hex' => '#008080'],
            ['nombre' => 'Índigo', 'codigo_hex' => '#4B0082'],
            ['nombre' => 'Violeta', 'codigo_hex' => '#EE82EE'],
            ['nombre' => 'Naranja', 'codigo_hex' => '#FFA500'],
            ['nombre' => 'Rosa', 'codigo_hex' => '#FFC0CB'],
            ['nombre' => 'Dorado', 'codigo_hex' => '#FFD700'],
            ['nombre' => 'Marrón', 'codigo_hex' => '#A52A2A'],
            ['nombre' => 'Beige', 'codigo_hex' => '#F5F5DC'],
            ['nombre' => 'Turquesa', 'codigo_hex' => '#40E0D0'],
            ['nombre' => 'Aguamarina', 'codigo_hex' => '#7FFFD4'],
            ['nombre' => 'Coral', 'codigo_hex' => '#FF7F50'],
            ['nombre' => 'Lavanda', 'codigo_hex' => '#E6E6FA'],
            ['nombre' => 'Esmeralda', 'codigo_hex' => '#50C878'],
            ['nombre' => 'Burdeos', 'codigo_hex' => '#800000'],
            ['nombre' => 'Caqui', 'codigo_hex' => '#F0E68C'],
            ['nombre' => 'Carmesí', 'codigo_hex' => '#DC143C'],
            ['nombre' => 'Chocolate', 'codigo_hex' => '#D2691E'],
            ['nombre' => 'Cerceta', 'codigo_hex' => '#008080'],
            ['nombre' => 'Mostaza', 'codigo_hex' => '#FFDB58'],
            ['nombre' => 'Pizarra', 'codigo_hex' => '#708090'],
            ['nombre' => 'Salmón', 'codigo_hex' => '#FA8072'],
            ['nombre' => 'Verde Oliva Oscuro', 'codigo_hex' => '#556B2F'],
            ['nombre' => 'Azul Acero', 'codigo_hex' => '#4682B4'],
            ['nombre' => 'Azul Medianoche', 'codigo_hex' => '#191970'],
            ['nombre' => 'Tomate', 'codigo_hex' => '#FF6347'],
            ['nombre' => 'Verde Bosque', 'codigo_hex' => '#228B22'],
            ['nombre' => 'Azul Real', 'codigo_hex' => '#4169E1'],
            ['nombre' => 'Rosa Caliente', 'codigo_hex' => '#FF69B4'],
            ['nombre' => 'Verde Mar', 'codigo_hex' => '#2E8B57'],
            ['nombre' => 'Orquídea', 'codigo_hex' => '#DA70D6'],
            ['nombre' => 'Lima Limón', 'codigo_hex' => '#32CD32'],
            ['nombre' => 'Magenta Oscuro', 'codigo_hex' => '#8B008B'],
            ['nombre' => 'Rojo Indio', 'codigo_hex' => '#CD5C5C'],
            ['nombre' => 'Verde Primavera', 'codigo_hex' => '#00FF7F'],
            ['nombre' => 'Azul Cielo', 'codigo_hex' => '#87CEEB'],
            ['nombre' => 'Rosa Palo', 'codigo_hex' => '#FFD1DC'],
            ['nombre' => 'Amarillo Maíz', 'codigo_hex' => '#FFF8DC'],
            ['nombre' => 'Azul Cobalto', 'codigo_hex' => '#0047AB'],
            ['nombre' => 'Siena', 'codigo_hex' => '#A0522D'],
        ];

        DB::table('colors')->insert($colores);
    }
}
