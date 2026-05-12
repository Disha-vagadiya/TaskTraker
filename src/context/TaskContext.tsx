import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Task } from '../types';
import { mockApi } from '../services/mockApi';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'userId'>) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await mockApi.getTasks(user.id);
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'userId'>) => {
    if (!user) return;
    try {
      const newTask = await mockApi.createTask({ ...taskData, userId: user.id });
      setTasks((prev) => [...prev, newTask]);
    } catch (err: any) {
      setError(err.message || 'Failed to add task');
      throw err;
    }
  };

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await mockApi.updateTask(taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await mockApi.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, fetchTasks, addTask, editTask, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
