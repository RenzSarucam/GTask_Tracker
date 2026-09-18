<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Admin-only: change a user's role or active status.
     *
     * Both fields are guarded against mass assignment on the model, so
     * they're set explicitly here rather than via $user->update($request->all()).
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'role' => ['sometimes', Rule::in(User::ROLES)],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('role', $validated) && $user->id === $request->user()->id) {
            return back()->withErrors(['role' => "You can't change your own role."]);
        }

        if (array_key_exists('is_active', $validated) && $user->id === $request->user()->id) {
            return back()->withErrors(['is_active' => "You can't deactivate your own account."]);
        }

        $user->forceFill($validated)->save();

        return back();
    }
}
