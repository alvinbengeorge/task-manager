"use client";

import React, { useState } from 'react';
import { Task } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import { useToast } from '@/context/ToastContext';
import TaskForm from '@/components/TaskForm';
import { Draggable } from '@hello-pangea/dnd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface TaskCardProps {
    task: Task;
    index: number;
}

const priorityColors = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    High: 'bg-rose-50 text-rose-700 border-rose-100',
};

const statusColors = {
    'To Do': 'bg-slate-100 text-slate-700 border-slate-200',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-100',
    'Done': 'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export default function TaskCard({ task, index }: TaskCardProps) {
    const { users, deleteTask } = useTaskContext();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const assignee = users.find(u => u.id === task.assigneeId);

    const handleDelete = () => {
        deleteTask(task.id);
        addToast('Task deleted successfully', 'success');
        setShowConfirmDelete(false);
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-lg shadow-slate-700/25 mb-4">
                <TaskForm existingTask={task} onClose={() => setIsEditing(false)} />
            </div>
        );
    }

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1
                    }}
                    className={`bg-white p-5 rounded-xl border ${snapshot.isDragging ? 'border-blue-300 shadow-xl shadow-slate-700/35' : 'border-slate-100 shadow-md shadow-slate-700/15 hover:shadow-lg hover:shadow-slate-700/25'} transition-all duration-300 block w-full text-left group mb-4`}
                >
                    <div className="flex justify-between items-start gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-slate-800 break-words">
                            {task.title}
                        </h3>
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Task"
                            >
                                <FiEdit size={18} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete Task"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
                            {task.status}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                            {task.priority} Priority
                        </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-[10px]">
                                {assignee ? assignee.name.charAt(0) : '?'}
                            </div>
                            <span>{assignee ? assignee.name : 'Unassigned'}</span>
                        </div>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>

                    {showConfirmDelete && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 rounded-xl p-4" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-100 w-full max-w-sm">
                                <h4 className="text-lg font-medium text-slate-900 mb-2">Delete Task?</h4>
                                <p className="text-sm text-slate-500 mb-4">Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowConfirmDelete(false)}
                                        className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
}
