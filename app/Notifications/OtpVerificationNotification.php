<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class OtpVerificationNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $code) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your GAISANO Task Tracker verification code')
            ->greeting('Verify your email')
            ->line('Enter this code to verify your email address:')
            ->line(new HtmlString(
                '<div style="font-size:28px;font-weight:700;letter-spacing:8px;text-align:center;margin:16px 0;">'.$this->code.'</div>'
            ))
            ->line('This code expires in 10 minutes.')
            ->line('If you did not create an account, no further action is required.');
    }
}
