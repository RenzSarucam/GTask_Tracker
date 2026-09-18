<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Create a new department. The short "code" is derived from the name
     * automatically so admins only have to type one field.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Department::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
        ]);

        $validated['code'] = $this->generateCode($validated['name']);

        Department::create($validated);

        return back();
    }

    private function generateCode(string $name): string
    {
        $base = strtoupper(preg_replace('/[^A-Za-z]/', '', $name));
        $base = substr($base, 0, 6) ?: 'DEPT';

        $code = $base;
        $suffix = 1;

        while (Department::where('code', $code)->exists()) {
            $code = $base.$suffix++;
        }

        return $code;
    }
}
