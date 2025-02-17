<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call(UsersSeeder::class);
        $this->call(TallasSeeder::class);
        $this->call(ColorsSeeder::class);
        $this->call(SettingSeeder::class);
        $this->call(CouponSeeder::class);
        /*User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);*/
    }
}
