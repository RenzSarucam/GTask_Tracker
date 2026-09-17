<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;

class LogAuthActivity
{
    public function onLogin(Login $event): void
    {
        ActivityLog::record(
            action: 'login',
            description: "{$event->user->email} logged in",
            userId: $event->user->getAuthIdentifier(),
        );
    }

    public function onFailed(Failed $event): void
    {
        ActivityLog::record(
            action: 'login_failed',
            description: 'Failed login attempt for '.($event->credentials['email'] ?? 'unknown'),
            userId: $event->user?->getAuthIdentifier(),
        );
    }

    public function onLogout(Logout $event): void
    {
        if (! $event->user) {
            return;
        }

        ActivityLog::record(
            action: 'logout',
            description: "{$event->user->email} logged out",
            userId: $event->user->getAuthIdentifier(),
        );
    }

    public function onLockout(Lockout $event): void
    {
        ActivityLog::record(
            action: 'login_lockout',
            description: 'Login throttled for '.($event->request->input('email') ?? 'unknown'),
        );
    }
}
