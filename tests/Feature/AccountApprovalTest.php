<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountApprovalTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_user_is_redirected_away_from_the_app(): void
    {
        $user = User::factory()->create(['account_status' => User::STATUS_PENDING]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('approval.pending'));
    }

    public function test_admin_can_approve_with_an_existing_department(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'account_status' => User::STATUS_APPROVED, 'is_active' => true]);
        $department = Department::factory()->create();
        $applicant = User::factory()->create(['account_status' => User::STATUS_PENDING]);

        $response = $this->actingAs($admin)->post("/users/{$applicant->id}/approve", [
            'department_id' => $department->id,
        ]);

        $response->assertRedirect();
        $applicant->refresh();
        $this->assertSame(User::STATUS_APPROVED, $applicant->account_status);
        $this->assertSame($department->id, $applicant->department_id);
    }

    public function test_admin_can_approve_by_creating_a_new_department(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'account_status' => User::STATUS_APPROVED, 'is_active' => true]);
        $applicant = User::factory()->create(['account_status' => User::STATUS_PENDING]);

        $response = $this->actingAs($admin)->post("/users/{$applicant->id}/approve", [
            'new_department_name' => 'Logistics',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('departments', ['name' => 'Logistics']);
        $applicant->refresh();
        $this->assertSame(User::STATUS_APPROVED, $applicant->account_status);
        $this->assertSame('Logistics', $applicant->department->name);
    }

    public function test_staff_cannot_approve_accounts(): void
    {
        $staff = User::factory()->create(['role' => User::ROLE_STAFF, 'account_status' => User::STATUS_APPROVED, 'is_active' => true]);
        $department = Department::factory()->create();
        $applicant = User::factory()->create(['account_status' => User::STATUS_PENDING]);

        $response = $this->actingAs($staff)->post("/users/{$applicant->id}/approve", [
            'department_id' => $department->id,
        ]);

        $response->assertForbidden();
        $this->assertSame(User::STATUS_PENDING, $applicant->fresh()->account_status);
    }

    public function test_admin_can_reject_an_applicant(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN, 'account_status' => User::STATUS_APPROVED, 'is_active' => true]);
        $applicant = User::factory()->create(['account_status' => User::STATUS_PENDING]);

        $response = $this->actingAs($admin)->post("/users/{$applicant->id}/reject");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $applicant->id]);
    }
}
