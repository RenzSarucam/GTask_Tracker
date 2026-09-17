<?php

namespace App\Providers;

use App\Listeners\LogAuthActivity;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Password::defaults(fn () => $this->app->isProduction()
            ? Password::min(12)->mixedCase()->numbers()->symbols()->uncompromised()
            : Password::min(12)->mixedCase()->numbers()->symbols());

        if ($this->app->isProduction()) {
            URL::forceScheme('https');
        }

        Event::listen(Login::class, [LogAuthActivity::class, 'onLogin']);
        Event::listen(Failed::class, [LogAuthActivity::class, 'onFailed']);
        Event::listen(Logout::class, [LogAuthActivity::class, 'onLogout']);
        Event::listen(Lockout::class, [LogAuthActivity::class, 'onLockout']);
    }
}
