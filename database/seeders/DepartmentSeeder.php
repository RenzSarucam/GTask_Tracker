<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'ICT / R&D', 'code' => 'ICT'],
            ['name' => 'Merchandising', 'code' => 'MERCH'],
            ['name' => 'Operations', 'code' => 'OPS'],
            ['name' => 'Marketing', 'code' => 'MKT'],
            ['name' => 'HR & Admin', 'code' => 'HR'],
        ];

        foreach ($departments as $department) {
            Department::firstOrCreate(['code' => $department['code']], $department);
        }
    }
}
