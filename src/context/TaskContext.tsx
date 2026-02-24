"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
    tasks: Task[];
    users: User[];
    isUsersLoading: boolean;
    usersError: string | null;
    addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    updateTask: (id: string, updatedFields: Partial<Task>) => void;
    deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks-v1', []);
    const [users, setUsers] = useState<User[]>([]);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                setIsUsersLoading(true);
                const res = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                if (isMounted) {
                    setUsers(data);
                    setUsersError(null);
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof Error) {
                        setUsersError(err.message);
                    } else {
                        setUsersError('An error occurred fetching users');
                    }
                }
            } finally {
                if (isMounted) {
                    setIsUsersLoading(false);
                }
            }
        };
        fetchUsers();
        return () => {
            isMounted = false;
        };
    }, []);

    const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        setTasks(prev => [newTask, ...prev]);
    }, [setTasks]);

    const updateTask = useCallback((id: string, updatedFields: Partial<Task>) => {
        setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedFields } : task));
    }, [setTasks]);

    const deleteTask = useCallback((id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    }, [setTasks]);

    return (
        <TaskContext.Provider value={{
            tasks,
            users,
            isUsersLoading,
            usersError,
            addTask,
            updateTask,
            deleteTask
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}
