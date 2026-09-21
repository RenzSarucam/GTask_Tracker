<?php

namespace App\Http\Middleware;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $canSeeApprovals = $user && $user->isAdmin() && $user->isApproved();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'pendingApprovalsCount' => $canSeeApprovals
                ? fn () => User::where('account_status', User::STATUS_PENDING)->count()
                : 0,
            'pendingApprovalsPreview' => $canSeeApprovals
                ? fn () => User::where('account_status', User::STATUS_PENDING)
                    ->with('department:id,name')
                    ->orderBy('created_at')
                    ->limit(5)
                    ->get(['id', 'name', 'email', 'department_id', 'requested_department_name'])
                    ->map(fn (User $applicant) => [
                        'id' => $applicant->id,
                        'name' => $applicant->name,
                        'email' => $applicant->email,
                        'department' => $applicant->department?->name ?? $applicant->requested_department_name,
                    ])
                : [],
        ];
    }
}
