{{ config('app.name') }}

Welcome, {{ $name }}
An admin created an account for you. Use these credentials to sign in:

Email: {{ $email }}
Temporary password: {{ $password }}

Sign in: {{ $loginUrl }}

For your security, change this password after signing in.
