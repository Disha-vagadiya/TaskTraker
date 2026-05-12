import React, { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useTasks } from '../context/TaskContext';
import { CheckCircle, Clock, AlertTriangle, ListTodo, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { TaskPriority, TaskStatus, Task } from '../types';

export const Dashboard: React.FC = () => {
  const { tasks, loading, fetchTasks, addTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'userId'>>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      pending: tasks.filter(t => t.status === 'Pending').length,
      overdue: tasks.filter(t => t.status === 'Pending' && new Date(t.dueDate) < now).length
    };
  }, [tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.dueDate) {
      setFormError('Title and due date are required');
      return;
    }

    setSubmitting(true);
    try {
      await addTask(formData);
      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date().toISOString().split('T')[0],
      });
    } catch (err: any) {
      setFormError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Here is a summary of your tasks.</p>
        </div>
        {/* <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          <span>Create Task</span>
        </Button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center">
          <div className="bg-green-100 p-3 rounded-full text-green-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
          </div>
        </div>

        {/* Overdue Tasks Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex items-center">
          <div className="bg-red-100 p-3 rounded-full text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Overdue</p>
            <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Tasks</h2>
          <Link to="/tasks" className="text-blue-600 hover:underline text-sm font-medium">View all tasks</Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No tasks found. Create one to get started!</p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Create your first task</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className={`font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        {formError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What needs to be done?"
          />

          <Input
            label="Description"
            as="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add some details..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Priority"
              as="select"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ]}
            />

            <Input
              label="Status"
              as="select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Completed', label: 'Completed' },
              ]}
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
};
