import type { Task, User } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getStorageTasks = (): Task[] => {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
};

const setStorageTasks = (tasks: Task[]) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getStorageUsers = (): (User & { password: string })[] => {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
};

const setStorageUsers = (users: (User & { password: string })[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const mockApi = {

  login: async (email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(800);
    const users = getStorageUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token: 'mock-jwt-token-' + user.id };
  },

  signup: async (name: string, email: string, password: string): Promise<{ user: User, token: string }> => {
    await delay(800);
    const users = getStorageUsers();

    if (users.some(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }

    const newUser = { id: Math.random().toString(36).substring(7), name, email, password };
    users.push(newUser);
    setStorageUsers(users);
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, token: 'mock-jwt-token-' + newUser.id };
  },

  resetPassword: async (email: string, currentPassword: string, newPassword: string): Promise<void> => {
    await delay(800);
    const users = getStorageUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      throw new Error('No user found with this email');
    }

    if (users[userIndex].password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    users[userIndex].password = newPassword;
    setStorageUsers(users);
  },


  getTasks: async (userId: string): Promise<Task[]> => {
    await delay(500);
    const tasks = getStorageTasks();
    return tasks.filter((t) => t.userId === userId);
  },

  createTask: async (taskData: Omit<Task, 'id'>): Promise<Task> => {
    await delay(500);
    const tasks = getStorageTasks();
    const newTask: Task = { ...taskData, id: Math.random().toString(36).substring(7) };
    tasks.push(newTask);
    setStorageTasks(tasks);
    return newTask;
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    await delay(500);
    const tasks = getStorageTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = { ...tasks[index], ...updates };
    tasks[index] = updatedTask;
    setStorageTasks(tasks);
    return updatedTask;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await delay(500);
    let tasks = getStorageTasks();
    tasks = tasks.filter((t) => t.id !== taskId);
    setStorageTasks(tasks);
  }
};
