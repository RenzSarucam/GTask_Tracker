<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response|RedirectResponse
    {
        if (! config('features.registration_enabled')) {
            return redirect()->route('login');
        }

        $departments = Department::query()
            ->with(['positions' => fn ($q) => $q->orderBy('name')])
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (Department $department) => [
                'id' => $department->id,
                'name' => $department->name,
                'positions' => $department->positions->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                ]),
            ]);

        return Inertia::render('Auth/Register', ['departments' => $departments]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        abort_unless(config('features.registration_enabled'), HttpResponse::HTTP_FORBIDDEN);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department_id' => ['nullable', 'required_without:new_department_name', 'exists:departments,id'],
            'new_department_name' => ['nullable', 'required_without:department_id', 'string', 'max:255'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'new_position_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => trim($validated['first_name'].' '.$validated['last_name']),
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'requested_department_name' => empty($validated['department_id']) ? ($validated['new_department_name'] ?? null) : null,
            'requested_position_name' => empty($validated['position_id']) ? ($validated['new_position_name'] ?? null) : null,
        ]);

        $user->forceFill([
            'department_id' => $validated['department_id'] ?? null,
            'position_id' => $validated['position_id'] ?? null,
            'account_status' => User::STATUS_PENDING,
        ])->save();

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
