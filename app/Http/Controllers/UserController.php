<?php

namespace App\Http\Controllers;

use App\Models\Position;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Admin-only: change a user's role, position, or active status.
     *
     * These fields are guarded against mass assignment on the model, so
     * they're set explicitly here rather than via $user->update($request->all()).
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'role' => ['sometimes', Rule::in(User::ROLES)],
            'position_id' => ['sometimes', 'nullable', 'exists:positions,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('role', $validated) && $user->id === $request->user()->id) {
            return back()->withErrors(['role' => "You can't change your own role."]);
        }

        if (array_key_exists('is_active', $validated) && $user->id === $request->user()->id) {
            return back()->withErrors(['is_active' => "You can't deactivate your own account."]);
        }

        if (! empty($validated['position_id'])) {
            $position = Position::findOrFail($validated['position_id']);

            if ($position->department_id !== $user->department_id) {
                return back()->withErrors(['position_id' => 'That position belongs to a different department.']);
            }
        }

        $user->forceFill($validated)->save();

        return back();
    }

    /**
     * Admin-only: permanently remove a user.
     *
     * Tasks the user created cascade-delete at the database level, so this
     * is blocked outright if they've created any — deactivating is the
     * right move for someone leaving the team, and outright deletion is
     * meant for mistaken/duplicate accounts that never accumulated data.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        if ($user->createdTasks()->exists()) {
            return back()->withErrors([
                'delete' => "Can't delete: this user has created tasks. Deactivate the account instead, or reassign/delete their tasks first.",
            ]);
        }

        $user->delete();

        return back();
    }
}
