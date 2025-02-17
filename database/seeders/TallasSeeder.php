<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TallasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tallas = [
            ['nombre' => 'XS'],
            ['nombre' => 'S'],
            ['nombre' => 'M'],
            ['nombre' => 'L'],
            ['nombre' => 'XL'],
            ['nombre' => 'XXL'],
            ['nombre' => 'Única'],
        ];

        DB::table('tallas')->insert($tallas);
    }
}
