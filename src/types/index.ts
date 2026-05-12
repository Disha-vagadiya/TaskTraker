export interface User {
  id: string;
  email: string;
  name: string;
}

export type TaskStatus = 'Pending' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  userId: string;
}

export interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}
