<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $this->authorize('viewAny', Task::class);

        $user = $request->user();

        $tasks = Task::query()
            ->with(['assignees:id,name', 'department:id,name'])
            ->when($user->isStaff(), fn ($q) => $q->whereHas(
                'assignees',
                fn ($a) => $a->whereKey($user->id)
            ))
            ->orderBy('position')
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->toDateString(),
                'progress' => $task->progress,
                'position' => $task->position,
                'is_overdue' => $task->isOverdue(),
                'department' => $task->department?->name,
                'department_id' => $task->department_id,
                'assignees' => $task->assignees->map(fn ($a) => ['id' => $a->id, 'name' => $a->name]),
                'can_update' => $request->user()->can('update', $task),
                'can_delete' => $request->user()->can('delete', $task),
            ]);

        $columns = collect(Task::STATUSES)->mapWithKeys(
            fn ($status) => [$status => $tasks->where('status', $status)->values()]
        );

        return Inertia::render('Board', [
            'columns' => $columns,
            'canCreate' => $request->user()->can('create', Task::class),
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'assignableUsers' => $user->isStaff() ? [] : User::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }
}
