<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $departments = Department::query()
            ->with(['positions' => fn ($q) => $q->orderBy('name')])
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Department $department) => [
                'id' => $department->id,
                'name' => $department->name,
                'positions' => $department->positions->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
            ]);

        return Inertia::render('Settings', [
            'departments' => $departments,
            'canManagePositions' => $request->user()->isAdmin(),
        ]);
    }
}
