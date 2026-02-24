"use client";

import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { useToast } from '@/context/ToastContext';
import { Priority, Status, Task } from '@/types';
import { FiX } from 'react-icons/fi';

interface TaskFormProps {
    existingTask?: Task;
    onClose: () => void;
}

export default function TaskForm({ existingTask, onClose }: TaskFormProps) {
    const { addTask, updateTask, users, isUsersLoading } = useTaskContext();
    const { addToast } = useToast();

    const [title, setTitle] = useState(existingTask?.title || '');
    const [description, setDescription] = useState(existingTask?.description || '');
    const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'Medium');
    const [status, setStatus] = useState<Status>(existingTask?.status || 'To Do');
    const [assigneeId, setAssigneeId] = useState<number | ''>(existingTask?.assigneeId || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority,
            status,
            assigneeId: assigneeId === '' ? undefined : Number(assigneeId),
        };

        if (existingTask) {
            updateTask(existingTask.id, taskData);
            addToast('Task updated successfully', 'success');
        } else {
            addTask(taskData);
            addToast('Task created successfully', 'success');
        }

        onClose();
    };

    return (
        <div className="w-full">
            {!existingTask && (
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Create New Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (error) setError('');
                        }}
                        placeholder="What needs to be done?"
                        className={`w-full rounded-md border text-slate-800 bg-white ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'} shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-shadow`}
                    />
                    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Add context and details..."
                        className="w-full rounded-md border text-slate-800 bg-white border-slate-200 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full rounded-md border text-slate-800 bg-white border-slate-200 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                            className="w-full rounded-md border text-slate-800 bg-white border-slate-200 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Assignee
                    </label>
                    <select
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : '')}
                        disabled={isUsersLoading}
                        className="w-full rounded-md border text-slate-800 bg-white border-slate-200 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-shadow"
                    >
                        <option value="">Unassigned</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    {isUsersLoading && <p className="mt-1 text-xs text-slate-500">Loading users...</p>}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 shadow-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        {existingTask ? 'Save Changes' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}
