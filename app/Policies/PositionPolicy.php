<?php

namespace App\Policies;

use App\Models\Position;
use App\Models\User;

class PositionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active;
    }

    public function view(User $user, Position $position): bool
    {
        return $user->is_active;
    }

    public function create(User $user): bool
    {
        return $user->is_active && $user->isAdmin();
    }

    public function update(User $user, Position $position): bool
    {
        return $user->is_active && $user->isAdmin();
    }

    public function delete(User $user, Position $position): bool
    {
        return $user->is_active && $user->isAdmin();
    }
}
