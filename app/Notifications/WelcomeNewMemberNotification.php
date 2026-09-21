<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNewMemberNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $temporaryPassword) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your '.config('app.name').' account is ready')
            ->view(['emails.welcome', 'emails.welcome-text'], [
                'name' => $notifiable->first_name,
                'email' => $notifiable->email,
                'password' => $this->temporaryPassword,
                'loginUrl' => route('login'),
            ]);
    }
}
