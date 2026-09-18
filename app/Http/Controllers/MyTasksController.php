<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyTasksController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $tasks = Task::query()
            ->with(['assignees:id,name', 'department:id,name'])
            ->whereHas('assignees', fn ($q) => $q->whereKey($user->id))
            ->orderBy('due_date')
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->toDateString(),
                'progress' => $task->progress,
                'is_overdue' => $task->isOverdue(),
                'department' => $task->department?->name,
                'department_id' => $task->department_id,
                'assignees' => $task->assignees->map(fn ($a) => ['id' => $a->id, 'name' => $a->name]),
                'can_update' => $request->user()->can('update', $task),
                'can_delete' => $request->user()->can('delete', $task),
            ]);

        return Inertia::render('MyTasks', [
            'tasks' => $tasks,
            'departments' => Department::orderBy('name')->get(['id', 'name']),
            'assignableUsers' => $user->isStaff() ? [] : User::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'canCreate' => $request->user()->can('create', Task::class),
        ]);
    }
}
