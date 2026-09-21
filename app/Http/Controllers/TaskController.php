<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssignedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Create a task at the end of its status column.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $assigneeIds = $validated['assignee_ids'] ?? [];
        unset($validated['assignee_ids']);

        $position = Task::where('status', $validated['status'])->max('position');

        $task = Task::create([
            ...$validated,
            'position' => $position === null ? 0 : $position + 1,
            'created_by' => $request->user()->id,
        ]);

        $sync = $task->assignees()->sync($assigneeIds);
        $this->notifyNewAssignees($task, $sync['attached'], $request->user());

        return back();
    }

    /**
     * Update a task. Staff are limited (by UpdateTaskRequest) to only
     * status/progress on tasks assigned to them.
     */
    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $validated = $request->validated();

        if (array_key_exists('assignee_ids', $validated)) {
            $sync = $task->assignees()->sync($validated['assignee_ids'] ?? []);
            $this->notifyNewAssignees($task, $sync['attached'], $request->user());
            unset($validated['assignee_ids']);
        }

        $task->update($validated);

        return back();
    }

    /**
     * Notify newly-assigned users, skipping whoever just made the change.
     */
    private function notifyNewAssignees(Task $task, array $attachedIds, User $actor): void
    {
        $recipientIds = array_diff($attachedIds, [$actor->id]);

        if (empty($recipientIds)) {
            return;
        }

        User::whereIn('id', $recipientIds)
            ->get()
            ->each(fn (User $user) => $user->notify(new TaskAssignedNotification($task, $actor)));
    }

    /**
     * Soft-delete a task.
     */
    public function destroy(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return back();
    }

    /**
     * Move a task to a new status/position (Kanban drag-and-drop).
     *
     * Shifts sibling positions in the affected column(s) so ordering stays
     * gap-free, all inside one transaction.
     */
    public function move(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'status' => ['required', Rule::in(Task::STATUSES)],
            'position' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($task, $validated) {
            $newStatus = $validated['status'];
            $newPosition = $validated['position'];
            $oldStatus = $task->status;
            $oldPosition = $task->position;

            if ($oldStatus === $newStatus) {
                if ($newPosition > $oldPosition) {
                    Task::where('status', $newStatus)
                        ->whereBetween('position', [$oldPosition + 1, $newPosition])
                        ->where('id', '!=', $task->id)
                        ->decrement('position');
                } elseif ($newPosition < $oldPosition) {
                    Task::where('status', $newStatus)
                        ->whereBetween('position', [$newPosition, $oldPosition - 1])
                        ->where('id', '!=', $task->id)
                        ->increment('position');
                }
            } else {
                Task::where('status', $oldStatus)
                    ->where('position', '>', $oldPosition)
                    ->decrement('position');

                Task::where('status', $newStatus)
                    ->where('position', '>=', $newPosition)
                    ->increment('position');
            }

            $task->update([
                'status' => $newStatus,
                'position' => $newPosition,
            ]);
        });

        return back();
    }
}
