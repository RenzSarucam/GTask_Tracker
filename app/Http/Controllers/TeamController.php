<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $members = User::query()
            ->with(['department:id,name', 'position:id,name,department_id'])
            ->withCount('tasks')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'employee_id' => $user->employee_id,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'department_id' => $user->department_id,
                'department' => $user->department?->name,
                'position_id' => $user->position_id,
                'position' => $user->position?->name,
                'tasks_count' => $user->tasks_count,
                'is_self' => $user->id === $request->user()->id,
            ]);

        // Positions grouped by department, so the UI can offer only the
        // positions that belong to a given member's department.
        $positionsByDepartment = Department::query()
            ->with(['positions' => fn ($q) => $q->orderBy('name')])
            ->get()
            ->mapWithKeys(fn (Department $department) => [
                $department->id => $department->positions->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
            ]);

        return Inertia::render('Team', [
            'members' => $members,
            'positionsByDepartment' => $positionsByDepartment,
            'canManage' => $request->user()->isAdmin(),
        ]);
    }
}
