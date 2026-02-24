"use client";

import React, { useState, useMemo } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Priority, Status } from '@/types';
import TaskControls from './TaskControls';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';

export default function TaskBoard() {
    const { tasks, usersError } = useTaskContext();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
    const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, debouncedSearchTerm, statusFilter, priorityFilter]);

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                        Task Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Manage your daily tasks and priorities efficiently.
                    </p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 shadow-md shadow-slate-700/25 hover:shadow-lg hover:shadow-slate-700/40 whitespace-nowrap flex items-center gap-2"
                >
                    <FiPlus size={20} />
                    Create Task
                </button>
            </div>

            {usersError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium">Failed to load users</h3>
                        <p className="text-sm mt-1">{usersError}</p>
                    </div>
                </div>
            )}

            <TaskControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                visibleCount={filteredTasks.length}
                totalCount={tasks.length}
            />

            <TaskList tasks={filteredTasks} />

            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-slate-700/25 w-full max-w-lg overflow-hidden border border-slate-100 p-6 m-auto">
                        <TaskForm onClose={() => setIsFormOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
