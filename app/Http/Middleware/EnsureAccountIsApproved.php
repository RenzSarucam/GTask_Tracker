<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsApproved
{
    /**
     * Redirect users whose account is still awaiting admin approval (or was
     * rejected) away from the main app to the pending-approval screen.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->account_status !== User::STATUS_APPROVED) {
            return redirect()->route('approval.pending');
        }

        return $next($request);
    }
}
