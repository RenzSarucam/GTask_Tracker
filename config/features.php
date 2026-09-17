<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Public Registration
    |--------------------------------------------------------------------------
    |
    | When disabled, the /register routes stop accepting new sign-ups and
    | redirect to the login page. Accounts must then be created by an admin.
    |
    */

    'registration_enabled' => (bool) env('REGISTRATION_ENABLED', true),

];
