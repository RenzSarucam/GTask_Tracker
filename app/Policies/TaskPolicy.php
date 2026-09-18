<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * The actual result set is scoped by role in the controller/query;
     * this only gates whether the index endpoint is reachable at all.
     */
    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAdmin() || $user->isManager()) {
            return true;
        }

        return $this->isAssignedTo($task, $user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->is_active && ($user->isAdmin() || $user->isManager());
    }

    /**
     * Determine whether the user can update the model.
     *
     * Admins and managers can edit any task. Staff may only update tasks
     * they are assigned to (status/progress), never tasks belonging to
     * other users — enforced here, not just hidden in the UI.
     */
    public function update(User $user, Task $task): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAdmin() || $user->isManager()) {
            return true;
        }

        return $this->isAssignedTo($task, $user);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * Admins can delete any task; managers only the ones they created;
     * staff can never delete tasks.
     */
    public function delete(User $user, Task $task): bool
    {
        if (! $user->is_active) {
            return false;
        }

        if ($user->isAdmin()) {
            return true;
        }

        return $user->isManager() && $task->created_by === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return $user->is_active && $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $user->is_active && $user->isAdmin();
    }

    private function isAssignedTo(Task $task, User $user): bool
    {
        return $task->assignees->contains('id', $user->id);
    }
}
