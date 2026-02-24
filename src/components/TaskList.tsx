"use client";

import React, { useState, useEffect } from 'react';
import { Status, Task } from '@/types';
import TaskCard from './TaskCard';
import { FiInbox } from 'react-icons/fi';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useTaskContext } from '@/context/TaskContext';

interface TaskListProps {
    tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
    const { updateTask } = useTaskContext();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const groupedTasks = {
        'To Do': tasks.filter(t => t.status === 'To Do'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'Done': tasks.filter(t => t.status === 'Done'),
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as Status;

        // Optimistically update if droppableId changed
        if (source.droppableId !== destination.droppableId) {
            updateTask(draggableId, { status: newStatus });
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="mt-8 text-center text-slate-400 py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FiInbox className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-sm font-medium text-slate-700 mb-1">No tasks found</h3>
                <p className="text-sm text-slate-500">
                    We couldn&apos;t find anything matching your criteria. Try adjusting your filters.
                </p>
            </div>
        );
    }

    if (!isMounted) {
        return null; // Prevent hydration mismatch with drag and drop
    }

    const columns: Status[] = ['To Do', 'In Progress', 'Done'];

    return (
        <div className="mt-6">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {columns.map((status) => (
                        <div key={status} className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col h-full min-h-[500px] shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-4 flex justify-between items-center">
                                {status}
                                <span className="bg-white text-xs py-0.5 px-2 rounded-full border border-slate-200 text-slate-500 shadow-sm">
                                    {groupedTasks[status].length}
                                </span>
                            </h3>

                            <Droppable droppableId={status}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-100' : ''}`}
                                    >
                                        {groupedTasks[status].map((task, index) => (
                                            <TaskCard key={task.id} task={task} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
