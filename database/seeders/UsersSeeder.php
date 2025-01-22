<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data=array(
            array(
                'name'=>'Isak Veliz',
                'email'=>'isa.veliz@gmail.com',
                'password'=>Hash::make('IsaacVelizAdmin'),
                'role'=>'admin',
                'status'=>'active'
            ),
            array(
                'name'=>'Rachel Starr',
                'email'=>'Rachel.starr@gmail.com',
                'password'=>Hash::make('RachelStarr'),
                'role'=>'user',
                'status'=>'active'
            ),
        );

        DB::table('users')->insert($data);
    }
}
