<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PendingApprovalController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->account_status === User::STATUS_APPROVED) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/PendingApproval', [
            'accountStatus' => $user->account_status,
            'departmentName' => $user->department?->name ?? $user->requested_department_name,
            'positionName' => $user->position?->name ?? $user->requested_position_name,
        ]);
    }
}
