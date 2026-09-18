<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Position;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PositionController extends Controller
{
    /**
     * Create a new position under a department.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Position::class);

        $validated = $request->validate([
            'department_id' => ['required', 'exists:departments,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('positions')->where(
                    fn ($query) => $query->where('department_id', $request->department_id)
                ),
            ],
        ]);

        Position::create($validated);

        return back();
    }

    /**
     * Rename a position.
     */
    public function update(Request $request, Position $position): RedirectResponse
    {
        $this->authorize('update', $position);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('positions')
                    ->where(fn ($query) => $query->where('department_id', $position->department_id))
                    ->ignore($position->id),
            ],
        ]);

        $position->update($validated);

        return back();
    }

    /**
     * Delete a position. Users holding it fall back to no position
     * (position_id is nullable and set to null on delete).
     */
    public function destroy(Position $position): RedirectResponse
    {
        $this->authorize('delete', $position);

        $position->delete();

        return back();
    }
}
