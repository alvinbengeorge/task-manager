"use client";

import React from 'react';
import { Priority, Status } from '@/types';
import { FiSearch } from 'react-icons/fi';

interface TaskControlsProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    statusFilter: Status | 'All';
    setStatusFilter: (val: Status | 'All') => void;
    priorityFilter: Priority | 'All';
    setPriorityFilter: (val: Priority | 'All') => void;
    visibleCount: number;
    totalCount: number;
}

export default function TaskControls({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    visibleCount,
    totalCount
}: TaskControlsProps) {

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-md shadow-slate-700/15 hover:shadow-lg hover:shadow-slate-700/25 transition-all duration-300 mb-6 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-1/3 relative">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border text-slate-800 bg-white border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
                    />
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
                        className="w-full sm:w-auto rounded-lg border text-slate-800 bg-white border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
                        className="w-full sm:w-auto rounded-lg border text-slate-800 bg-white border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
            </div>

            <div className="text-sm text-slate-500 font-medium">
                Showing {visibleCount} of {totalCount} tasks
            </div>
        </div>
    );
}
