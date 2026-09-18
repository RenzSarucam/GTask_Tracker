<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $ict = Department::where('code', 'ICT')->first();

        if (! $ict) {
            return;
        }

        foreach (['R&D', 'Web Developer', 'DevOps', 'ICT Support', 'ICT Admin'] as $name) {
            Position::firstOrCreate(['department_id' => $ict->id, 'name' => $name]);
        }
    }
}
