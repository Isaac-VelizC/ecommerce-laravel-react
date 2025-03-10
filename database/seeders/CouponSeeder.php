<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $data=array(
            array(
                'code'=>'July202',
                'type'=>'Fijo',
                'value'=>'300',
                'status'=>'active'
            ),
            array(
                'code'=>'Rachel012',
                'type'=>'Porcentaje',
                'value'=>'10',
                'status'=>'active'
            ),
        );

        DB::table('coupons')->insert($data);
    }
}
