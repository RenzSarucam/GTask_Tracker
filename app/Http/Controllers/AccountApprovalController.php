<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AccountApprovalController extends Controller
{
    /**
     * Approve a pending registration, assigning it a department/position.
     * Either an existing department/position id is supplied, or a new
     * name to create one on the spot (mirrors the Settings positions
     * manager's "create as you go" pattern).
     */
    public function approve(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'department_id' => ['nullable', 'required_without:new_department_name', 'exists:departments,id'],
            'new_department_name' => ['nullable', 'required_without:department_id', 'string', 'max:255', 'unique:departments,name'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'new_position_name' => ['nullable', 'string', 'max:255'],
        ]);

        $department = ! empty($validated['department_id'])
            ? Department::findOrFail($validated['department_id'])
            : Department::create([
                'name' => $validated['new_department_name'],
                'code' => Department::generateCode($validated['new_department_name']),
            ]);

        $position = null;

        if (! empty($validated['position_id'])) {
            $position = Position::findOrFail($validated['position_id']);

            if ($position->department_id !== $department->id) {
                return back()->withErrors(['position_id' => 'That position belongs to a different department.']);
            }
        } elseif (! empty($validated['new_position_name'])) {
            $position = Position::create([
                'department_id' => $department->id,
                'name' => $validated['new_position_name'],
            ]);
        }

        $user->forceFill([
            'department_id' => $department->id,
            'position_id' => $position?->id,
            'requested_department_name' => null,
            'requested_position_name' => null,
            'account_status' => User::STATUS_APPROVED,
        ])->save();

        return back()->with('status', 'user-approved');
    }

    /**
     * Reject a pending registration. Since a rejected signup has no other
     * data attached to it yet, the account is simply removed.
     */
    public function reject(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return back()->with('status', 'user-rejected');
    }
}
