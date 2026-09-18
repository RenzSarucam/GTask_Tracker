import Column from '@/Components/Board/Column';
import TaskCard from '@/Components/Board/TaskCard';
import ConfirmDialog from '@/Components/ConfirmDialog';
import TaskFormModal from '@/Components/Tasks/TaskFormModal';
import { useRegisterTopbar } from '@/Contexts/TopbarContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

const COLUMN_TITLES = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

export default function Board({ columns: initialColumns, canCreate, departments, assignableUsers }) {
    const { auth } = usePage().props;
    const isStaff = auth.user.role === 'staff';

    const [columns, setColumns] = useState(initialColumns);
    const [activeTask, setActiveTask] = useState(null);
    const [modalState, setModalState] = useState({ open: false, task: null, defaultStatus: 'todo' });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
    );

    function findColumnOf(id) {
        return Object.keys(columns).find((key) => columns[key].some((t) => t.id === id));
    }

    function handleDragStart(event) {
        const col = findColumnOf(event.active.id);
        if (col) setActiveTask(columns[col].find((t) => t.id === event.active.id));
    }

    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const activeCol = findColumnOf(active.id);
        const overCol = columns[over.id] ? over.id : findColumnOf(over.id);
        if (!activeCol || !overCol || activeCol === overCol) return;

        setColumns((prev) => {
            const activeItems = prev[activeCol];
            const overItems = prev[overCol];
            const activeIndex = activeItems.findIndex((t) => t.id === active.id);
            if (activeIndex === -1) return prev;

            const overIndex = overItems.findIndex((t) => t.id === over.id);
            const newActiveItems = [...activeItems];
            const [moved] = newActiveItems.splice(activeIndex, 1);
            const newOverItems = [...overItems];
            const insertAt = overIndex >= 0 ? overIndex : newOverItems.length;
            newOverItems.splice(insertAt, 0, { ...moved, status: overCol });

            return { ...prev, [activeCol]: newActiveItems, [overCol]: newOverItems };
        });
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        setActiveTask(null);
        if (!over) return;

        const activeCol = findColumnOf(active.id);
        const overCol = columns[over.id] ? over.id : findColumnOf(over.id);
        if (!activeCol || !overCol) return;

        let nextColumns = columns;

        if (activeCol === overCol && active.id !== over.id) {
            const items = columns[activeCol];
            const activeIndex = items.findIndex((t) => t.id === active.id);
            const overIndex = items.findIndex((t) => t.id === over.id);

            if (activeIndex !== -1 && overIndex !== -1) {
                nextColumns = { ...columns, [activeCol]: arrayMove(items, activeIndex, overIndex) };
                setColumns(nextColumns);
            }
        }

        const finalItems = nextColumns[overCol];
        const newPosition = finalItems.findIndex((t) => t.id === active.id);
        if (newPosition === -1) return;

        router.patch(
            route('tasks.move', active.id),
            { status: overCol, position: newPosition },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => router.reload({ only: ['columns'] }),
            },
        );
    }

    function openCreate(status) {
        setModalState({ open: true, task: null, defaultStatus: status });
    }

    function openEdit(task) {
        setModalState({ open: true, task, defaultStatus: task.status });
    }

    function closeModal() {
        setModalState((prev) => ({ ...prev, open: false }));
    }

    useRegisterTopbar({
        onNewTask: canCreate ? () => openCreate('todo') : undefined,
    });

    function confirmDelete() {
        setDeleting(true);
        router.delete(route('tasks.destroy', deleteTarget.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
                closeModal();
            },
        });
    }

    return (
        <>
            <Head title="Board" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col gap-4 overflow-x-auto pb-2 lg:flex-row">
                    {Object.keys(COLUMN_TITLES).map((status) => (
                        <Column
                            key={status}
                            id={status}
                            title={COLUMN_TITLES[status]}
                            tasks={columns[status] ?? []}
                            onTaskClick={openEdit}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask && <TaskCard task={activeTask} disabled={false} />}
                </DragOverlay>
            </DndContext>

            <TaskFormModal
                open={modalState.open}
                onClose={closeModal}
                task={modalState.task}
                defaultStatus={modalState.defaultStatus}
                departments={departments}
                assignableUsers={assignableUsers}
                staffLimited={isStaff}
                onDelete={(task) => setDeleteTarget(task)}
            />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
                processing={deleting}
                title="Delete this task?"
                message={`"${deleteTarget?.title}" will be permanently removed from the board.`}
                confirmLabel="Delete task"
            />
        </>
    );
}

Board.layout = (page) => (
    <AuthenticatedLayout title="Board" subtitle="Drag and drop to update task status">
        {page}
    </AuthenticatedLayout>
);
