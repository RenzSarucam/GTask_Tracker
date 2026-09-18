<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Credentials for these accounts are documented in the README, not
     * printed to the console.
     */
    public function run(): void
    {
        $ict = Department::where('code', 'ICT')->first();
        $password = Hash::make('GaisanoDemo#2025');

        $accounts = [
            [
                'first_name' => 'Alex',
                'last_name' => 'Villanueva',
                'email' => 'admin@gaisano.local',
                'employee_id' => 'ICT-0001',
                'role' => User::ROLE_ADMIN,
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'email' => 'manager@gaisano.local',
                'employee_id' => 'ICT-0002',
                'role' => User::ROLE_MANAGER,
            ],
            [
                'first_name' => 'Jonas',
                'last_name' => 'Reyes',
                'email' => 'staff1@gaisano.local',
                'employee_id' => 'ICT-0003',
                'role' => User::ROLE_STAFF,
            ],
            [
                'first_name' => 'Krystal',
                'last_name' => 'Dela Cruz',
                'email' => 'staff2@gaisano.local',
                'employee_id' => 'ICT-0004',
                'role' => User::ROLE_STAFF,
            ],
            [
                'first_name' => 'Miguel',
                'last_name' => 'Torres',
                'email' => 'staff3@gaisano.local',
                'employee_id' => 'ICT-0005',
                'role' => User::ROLE_STAFF,
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'first_name' => $account['first_name'],
                    'last_name' => $account['last_name'],
                    'name' => "{$account['first_name']} {$account['last_name']}",
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );

            // role, employee_id, department_id, and is_active are guarded
            // against mass assignment; set them directly here.
            $user->forceFill([
                'role' => $account['role'],
                'employee_id' => $account['employee_id'],
                'department_id' => $ict?->id,
                'is_active' => true,
            ])->save();
        }
    }
}
