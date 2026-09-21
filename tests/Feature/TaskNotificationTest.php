<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskNotificationTest extends TestCase
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

    public function test_creating_a_task_notifies_its_assignees(): void
    {
        $admin = $this->admin();
        $assignee = User::factory()->create();

        $this->actingAs($admin)->post('/tasks', [
            'title' => 'Ship the release notes',
            'priority' => 'medium',
            'status' => 'todo',
            'assignee_ids' => [$assignee->id],
        ]);

        $this->assertSame(1, $assignee->fresh()->unreadNotifications()->count());
        $this->assertSame(0, $admin->fresh()->unreadNotifications()->count());
    }

    public function test_adding_an_assignee_on_update_notifies_only_the_new_one(): void
    {
        $admin = $this->admin();
        $alreadyAssigned = User::factory()->create();
        $newlyAssigned = User::factory()->create();

        $task = Task::factory()->create(['created_by' => $admin->id]);
        $task->assignees()->sync([$alreadyAssigned->id]);

        $this->actingAs($admin)->patch("/tasks/{$task->id}", [
            'title' => $task->title,
            'priority' => $task->priority,
            'status' => $task->status,
            'assignee_ids' => [$alreadyAssigned->id, $newlyAssigned->id],
        ]);

        $this->assertSame(0, $alreadyAssigned->fresh()->unreadNotifications()->count());
        $this->assertSame(1, $newlyAssigned->fresh()->unreadNotifications()->count());
    }

    public function test_assigning_yourself_does_not_notify_yourself(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/tasks', [
            'title' => 'Self-assigned cleanup',
            'priority' => 'low',
            'status' => 'todo',
            'assignee_ids' => [$admin->id],
        ]);

        $this->assertSame(0, $admin->fresh()->unreadNotifications()->count());
    }

    public function test_user_can_mark_their_own_notification_read_and_is_redirected(): void
    {
        $admin = $this->admin();
        $assignee = User::factory()->create();
        $task = Task::factory()->create(['created_by' => $admin->id]);

        $this->actingAs($admin)->post('/tasks', [
            'title' => 'Audit the logs',
            'priority' => 'high',
            'status' => 'todo',
            'assignee_ids' => [$assignee->id],
        ]);
        $notification = $assignee->fresh()->unreadNotifications()->first();

        $response = $this->actingAs($assignee)->post("/notifications/{$notification->id}/read");

        $response->assertRedirect(route('my-tasks'));
        $this->assertSame(0, $assignee->fresh()->unreadNotifications()->count());
    }

    public function test_user_cannot_mark_someone_elses_notification_read(): void
    {
        $admin = $this->admin();
        $assignee = User::factory()->create();
        $intruder = User::factory()->create();

        $this->actingAs($admin)->post('/tasks', [
            'title' => 'Confidential task',
            'priority' => 'high',
            'status' => 'todo',
            'assignee_ids' => [$assignee->id],
        ]);
        $notification = $assignee->fresh()->unreadNotifications()->first();

        $response = $this->actingAs($intruder)->post("/notifications/{$notification->id}/read");

        $response->assertForbidden();
        $this->assertSame(1, $assignee->fresh()->unreadNotifications()->count());
    }

    public function test_mark_all_read_clears_every_unread_notification(): void
    {
        $admin = $this->admin();
        $assignee = User::factory()->create();

        foreach (['First task', 'Second task'] as $title) {
            $this->actingAs($admin)->post('/tasks', [
                'title' => $title,
                'priority' => 'medium',
                'status' => 'todo',
                'assignee_ids' => [$assignee->id],
            ]);
        }

        $this->assertSame(2, $assignee->fresh()->unreadNotifications()->count());

        $this->actingAs($assignee)->post('/notifications/read-all');

        $this->assertSame(0, $assignee->fresh()->unreadNotifications()->count());
    }
}
