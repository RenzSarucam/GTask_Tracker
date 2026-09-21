<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * Mark one notification read and send the user to where it points.
     */
    public function read(Request $request, DatabaseNotification $notification): RedirectResponse
    {
        abort_unless(
            $notification->notifiable_type === $request->user()::class
                && $notification->notifiable_id === $request->user()->id,
            403,
        );

        $notification->markAsRead();

        return match ($notification->data['type'] ?? null) {
            'task_assigned' => redirect()->route('my-tasks'),
            default => back(),
        };
    }

    /**
     * Mark every unread notification read without navigating away.
     */
    public function readAll(Request $request): RedirectResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }
}
