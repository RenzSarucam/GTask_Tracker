<?php

namespace App\Http\Controllers;

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
            ->with('department:id,name')
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
                'department' => $user->department?->name,
                'tasks_count' => $user->tasks_count,
                'is_self' => $user->id === $request->user()->id,
            ]);

        return Inertia::render('Team', [
            'members' => $members,
            'canManage' => $request->user()->isAdmin(),
        ]);
    }
}
