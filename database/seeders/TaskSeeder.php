<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $creators = User::whereIn('role', [User::ROLE_ADMIN, User::ROLE_MANAGER])->get();
        $staff = User::where('role', User::ROLE_STAFF)->get();
        $departments = Department::all();

        if ($creators->isEmpty() || $staff->isEmpty() || $departments->isEmpty()) {
            return;
        }

        $tasks = [
            ['Redesign employee onboarding flow', Task::STATUS_IN_PROGRESS, Task::PRIORITY_HIGH, 65, -3],
            ['QA pass on POS sync module', Task::STATUS_TODO, Task::PRIORITY_MEDIUM, 0, -5],
            ['Deploy monthly sales report', Task::STATUS_DONE, Task::PRIORITY_LOW, 100, -20],
            ['Patch inventory API rate limiting', Task::STATUS_IN_PROGRESS, Task::PRIORITY_HIGH, 40, -1],
            ['Migrate legacy file server to NAS', Task::STATUS_TODO, Task::PRIORITY_MEDIUM, 0, 10],
            ['Set up CCTV network for new branch', Task::STATUS_TODO, Task::PRIORITY_HIGH, 0, 4],
            ['Renew SSL certificates for portal', Task::STATUS_DONE, Task::PRIORITY_MEDIUM, 100, -10],
            ['Audit user access logs for Q3', Task::STATUS_IN_PROGRESS, Task::PRIORITY_MEDIUM, 55, -2],
            ['Write API docs for task tracker', Task::STATUS_TODO, Task::PRIORITY_LOW, 0, 7],
            ['Fix printer driver rollout script', Task::STATUS_DONE, Task::PRIORITY_LOW, 100, -15],
            ['Evaluate backup solution vendors', Task::STATUS_TODO, Task::PRIORITY_MEDIUM, 0, 14],
            ['Upgrade branch routers firmware', Task::STATUS_IN_PROGRESS, Task::PRIORITY_HIGH, 20, -4],
            ['Prepare ICT budget proposal 2026', Task::STATUS_TODO, Task::PRIORITY_HIGH, 0, 3],
            ['Clean up unused cloud storage buckets', Task::STATUS_DONE, Task::PRIORITY_LOW, 100, -8],
            ['Test disaster recovery failover', Task::STATUS_IN_PROGRESS, Task::PRIORITY_HIGH, 75, -6],
            ['Onboard new hire laptop provisioning', Task::STATUS_TODO, Task::PRIORITY_MEDIUM, 0, 2],
            ['Review vendor SLA for network uplink', Task::STATUS_TODO, Task::PRIORITY_LOW, 0, 20],
            ['Update employee handbook portal page', Task::STATUS_DONE, Task::PRIORITY_LOW, 100, -12],
            ['Investigate POS terminal downtime', Task::STATUS_IN_PROGRESS, Task::PRIORITY_HIGH, 30, -1],
            ['Plan Q1 systems maintenance window', Task::STATUS_TODO, Task::PRIORITY_MEDIUM, 0, 25],
        ];

        $position = [];

        foreach ($tasks as $i => [$title, $status, $priority, $progress, $dueOffsetDays]) {
            $creator = $creators->random();
            $assignees = $staff->random(min(random_int(1, 2), $staff->count()));
            $department = $departments->random();

            $position[$status] = ($position[$status] ?? -1) + 1;

            $task = Task::create([
                'title' => $title,
                'description' => 'Sample seeded task for local development and design review.',
                'status' => $status,
                'priority' => $priority,
                'due_date' => Carbon::now()->addDays($dueOffsetDays),
                'progress' => $progress,
                'position' => $position[$status],
                'created_by' => $creator->id,
                'department_id' => $department->id,
            ]);

            $task->assignees()->attach($assignees->pluck('id'));
        }
    }
}
