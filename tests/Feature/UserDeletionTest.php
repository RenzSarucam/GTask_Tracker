<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserDeletionTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create([
            'role' => User::ROLE_ADMIN,
            'account_status' => User::STATUS_APPROVED,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_delete_a_member_with_no_created_tasks(): void
    {
        $admin = $this->admin();
        $member = User::factory()->create();

        $response = $this->actingAs($admin)->delete("/users/{$member->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $member->id]);
    }

    public function test_deleting_a_member_who_created_tasks_is_blocked(): void
    {
        $admin = $this->admin();
        $member = User::factory()->create();
        Task::factory()->create(['created_by' => $member->id]);

        $response = $this->actingAs($admin)->delete("/users/{$member->id}");

        $response->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('users', ['id' => $member->id]);
    }

    public function test_staff_cannot_delete_members(): void
    {
        $staff = User::factory()->create([
            'role' => User::ROLE_STAFF,
            'account_status' => User::STATUS_APPROVED,
            'is_active' => true,
        ]);
        $member = User::factory()->create();

        $response = $this->actingAs($staff)->delete("/users/{$member->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $member->id]);
    }

    public function test_admin_cannot_delete_their_own_account_this_way(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->delete("/users/{$admin->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
