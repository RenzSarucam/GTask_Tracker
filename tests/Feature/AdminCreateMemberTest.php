<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use App\Notifications\WelcomeNewMemberNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminCreateMemberTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => User::ROLE_ADMIN]);
    }

    public function test_admin_can_create_a_staff_account_with_an_existing_department(): void
    {
        Notification::fake();
        $admin = $this->admin();
        $department = Department::factory()->create();

        $response = $this->actingAs($admin)->post('/users', [
            'first_name' => 'New',
            'last_name' => 'Hire',
            'email' => 'newhire@gaisano.local',
            'role' => 'staff',
            'department_id' => $department->id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'newhire@gaisano.local',
            'role' => 'staff',
            'account_status' => User::STATUS_APPROVED,
            'department_id' => $department->id,
        ]);

        $newUser = User::where('email', 'newhire@gaisano.local')->first();
        $this->assertNotNull($newUser->email_verified_at);
        Notification::assertSentTo($newUser, WelcomeNewMemberNotification::class);
    }

    public function test_admin_can_create_a_manager_while_creating_a_new_department(): void
    {
        Notification::fake();
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/users', [
            'first_name' => 'Nadia',
            'last_name' => 'Cruz',
            'email' => 'nadia@gaisano.local',
            'role' => 'manager',
            'new_department_name' => 'Procurement',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('departments', ['name' => 'Procurement']);
        $this->assertDatabaseHas('users', [
            'email' => 'nadia@gaisano.local',
            'role' => 'manager',
        ]);
    }

    public function test_staff_cannot_create_accounts(): void
    {
        $staff = User::factory()->create(['role' => User::ROLE_STAFF]);

        $response = $this->actingAs($staff)->post('/users', [
            'first_name' => 'Nope',
            'last_name' => 'Denied',
            'email' => 'nope@gaisano.local',
            'role' => 'staff',
        ]);

        $response->assertForbidden();
        $this->assertDatabaseMissing('users', ['email' => 'nope@gaisano.local']);
    }

    public function test_admin_cannot_create_another_admin_through_this_endpoint(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/users', [
            'first_name' => 'Sneaky',
            'last_name' => 'Admin',
            'email' => 'sneaky@gaisano.local',
            'role' => 'admin',
        ]);

        $response->assertSessionHasErrors('role');
        $this->assertDatabaseMissing('users', ['email' => 'sneaky@gaisano.local']);
    }

    public function test_email_must_be_unique(): void
    {
        $admin = $this->admin();
        $existing = User::factory()->create();

        $response = $this->actingAs($admin)->post('/users', [
            'first_name' => 'Dup',
            'last_name' => 'Licate',
            'email' => $existing->email,
            'role' => 'staff',
        ]);

        $response->assertSessionHasErrors('email');
    }
}
