<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $now = Carbon::now();
        $weekAgo = $now->copy()->subDays(7);

        $scoped = fn () => $user->isStaff()
            ? Task::query()->whereHas('assignees', fn ($q) => $q->whereKey($user->id))
            : Task::query();

        $stats = [
            'total' => $this->trend(
                fn (Carbon $asOf) => (clone $scoped())->where('created_at', '<=', $asOf),
                $now,
                $weekAgo,
                positiveIsGood: true,
            ),
            'in_progress' => $this->trend(
                fn (Carbon $asOf) => (clone $scoped())->where('status', Task::STATUS_IN_PROGRESS)->where('created_at', '<=', $asOf),
                $now,
                $weekAgo,
                positiveIsGood: true,
            ),
            'completed' => $this->trend(
                fn (Carbon $asOf) => (clone $scoped())->where('status', Task::STATUS_DONE)->where('created_at', '<=', $asOf),
                $now,
                $weekAgo,
                positiveIsGood: true,
            ),
            'overdue' => $this->trend(
                fn (Carbon $asOf) => (clone $scoped())
                    ->where('status', '!=', Task::STATUS_DONE)
                    ->whereNotNull('due_date')
                    ->where('due_date', '<', $asOf)
                    ->where('created_at', '<=', $asOf),
                $now,
                $weekAgo,
                positiveIsGood: false,
            ),
        ];

        $dueSoon = (clone $scoped())
            ->with(['assignees:id,name', 'department:id,name'])
            ->whereNotNull('due_date')
            ->where('status', '!=', Task::STATUS_DONE)
            ->orderBy('due_date')
            ->limit(6)
            ->get(['id', 'title', 'status', 'priority', 'due_date', 'progress', 'department_id'])
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'status' => $task->status,
                'priority' => $task->priority,
                'due_date' => $task->due_date?->toDateString(),
                'progress' => $task->progress,
                'is_overdue' => $task->isOverdue(),
                'department' => $task->department?->name,
                'assignees' => $task->assignees->pluck('name'),
            ]);

        $recentActivity = $this->recentActivity($user->isStaff() ? $user->id : null);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'dueSoon' => $dueSoon,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * @return array{value: int, change: int, positiveIsGood: bool}
     */
    private function trend(callable $countQuery, Carbon $now, Carbon $weekAgo, bool $positiveIsGood): array
    {
        $current = $countQuery($now)->count();
        $previous = $countQuery($weekAgo)->count();

        $change = match (true) {
            $previous > 0 => (int) round((($current - $previous) / $previous) * 100),
            $current > 0 => 100,
            default => 0,
        };

        return [
            'value' => $current,
            'change' => $change,
            'positiveIsGood' => $positiveIsGood,
        ];
    }

    private function recentActivity(?int $onlyUserId): array
    {
        $authEvents = ActivityLog::query()
            ->with('user:id,name')
            ->when($onlyUserId, fn ($q) => $q->where('user_id', $onlyUserId))
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (ActivityLog $log) => [
                'type' => $log->action,
                'description' => $log->description ?? $log->action,
                'at' => $log->created_at->toIso8601String(),
            ]);

        $taskEvents = Task::query()
            ->with('creator:id,name')
            ->when($onlyUserId, fn ($q) => $q->whereHas('assignees', fn ($a) => $a->whereKey($onlyUserId)))
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Task $task) => [
                'type' => 'task_created',
                'description' => "{$task->creator?->name} created \"{$task->title}\"",
                'at' => $task->created_at->toIso8601String(),
            ]);

        return $authEvents->concat($taskEvents)
            ->sortByDesc('at')
            ->take(6)
            ->values()
            ->all();
    }
}
