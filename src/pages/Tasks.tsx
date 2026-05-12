import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { useTasks } from '../context/TaskContext';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Search, Edit2, Trash2, ListTodo } from 'lucide-react';

const emptyTask: Omit<Task, 'id' | 'userId'> = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: new Date().toISOString().split('T')[0],
};

export const Tasks: React.FC = () => {
  const { tasks, loading, fetchTasks, addTask, editTask, removeTask } = useTasks();

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'userId'>>(emptyTask);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t =>
        (statusFilter === 'All' || t.status === statusFilter) &&
        (priorityFilter === 'All' || t.priority === priorityFilter) &&
        (t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
          const priorityWeight = { High: 3, Medium: 2, Low: 1 };
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
      });
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy]);


  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('dueDate');
    setCurrentPage(1);
  };

  const openModalForCreate = () => {
    setFormData(emptyTask);
    setEditingTaskId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const openModalForEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    });
    setEditingTaskId(task.id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.dueDate) {
      setFormError('Title and due date are required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTaskId) {
        await editTask(editingTaskId, formData);
      } else {
        await addTask(formData);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await removeTask(id);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <p className="text-gray-600">Manage your daily tasks and priorities.</p>
        </div>
        <Button onClick={openModalForCreate} className="flex items-center gap-2">
          <Plus size={20} />
          <span>New Task</span>
        </Button>
      </div>


      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <Button variant="secondary" onClick={resetFilters} className="w-full" style={{ height: '42px' }}>
          Reset Filters
        </Button>
      </div>


      {loading && tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
          <ListTodo size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-1">No tasks found</p>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or create a new task.</p>
          <Button onClick={openModalForCreate} variant="secondary">Create a Task</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedTasks.map(task => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border p-5 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.title}
                  </h3>
                  <div className="flex gap-2 text-gray-400">
                    <button onClick={() => openModalForEdit(task)} className="hover:text-blue-600" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="hover:text-red-600" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                  {task.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {task.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {task.priority} Priority
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full font-medium bg-purple-100 text-purple-800">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 pb-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm transition-colors ${currentPage === i + 1
                        ? 'bg-blue-600 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100 border'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTaskId ? 'Edit Task' : 'Create New Task'}
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
              {editingTaskId ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
};
