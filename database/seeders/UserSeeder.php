<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    protected $model = User::class;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => "admin",
            'email' => 'ankur.singh@sawtee.org',
            'password' => Hash::make('Stranger-Muzzle6-Purely'),
        ]);
        // User::factory()->count(5)->create();
    }
}
