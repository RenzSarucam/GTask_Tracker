<?php

namespace App\Http\Requests;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('task'));
    }

    /**
     * Staff may only ever change status/progress on tasks assigned to them
     * (enforced here at the field level, not just by hiding fields in the
     * UI) — everything else requires admin/manager.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        if ($this->user()->isStaff()) {
            return [
                'status' => ['required', Rule::in(Task::STATUSES)],
                'progress' => ['required', 'integer', 'min:0', 'max:100'],
            ];
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'priority' => ['required', Rule::in(Task::PRIORITIES)],
            'status' => ['required', Rule::in(Task::STATUSES)],
            'due_date' => ['nullable', 'date'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'assignee_ids' => ['nullable', 'array'],
            'assignee_ids.*' => ['integer', Rule::exists(User::class, 'id')],
        ];
    }
}
