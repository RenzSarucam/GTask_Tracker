<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use App\Notifications\WelcomeNewMemberNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Admin-only: create a staff/manager account directly, skipping the
     * self-registration OTP + approval flow since the admin is the
     * approver. A random password is generated and emailed to the new
     * member (never returned in the response body).
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'role' => ['required', Rule::in([User::ROLE_STAFF, User::ROLE_MANAGER])],
            'department_id' => ['nullable', 'exists:departments,id'],
            'new_department_name' => ['nullable', 'string', 'max:255', 'unique:departments,name'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'new_position_name' => ['nullable', 'string', 'max:255'],
        ]);

        $department = null;

        if (! empty($validated['department_id'])) {
            $department = Department::findOrFail($validated['department_id']);
        } elseif (! empty($validated['new_department_name'])) {
            $department = Department::create([
                'name' => $validated['new_department_name'],
                'code' => Department::generateCode($validated['new_department_name']),
            ]);
        }

        $position = null;

        if (! empty($validated['position_id'])) {
            $position = Position::findOrFail($validated['position_id']);

            if ($department && $position->department_id !== $department->id) {
                return back()->withErrors(['position_id' => 'That position belongs to a different department.']);
            }
        } elseif (! empty($validated['new_position_name']) && $department) {
            $position = Position::create([
                'department_id' => $department->id,
                'name' => $validated['new_position_name'],
            ]);
        }

        $temporaryPassword = Str::password(12);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
            'email' => $validated['email'],
            'password' => Hash::make($temporaryPassword),
        ]);

        $user->forceFill([
            'role' => $validated['role'],
            'department_id' => $department?->id,
            'position_id' => $position?->id,
            'account_status' => User::STATUS_APPROVED,
            'email_verified_at' => now(),
        ])->save();

        $user->notify(new WelcomeNewMemberNotification($temporaryPassword));

        return back()->with('status', "Account created for {$user->name} — login details were emailed to {$user->email}.");
    }

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
