// Tasks.jsx - Main Tasks Page
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksAsync } from '../redux/slices/taskSlice';
import TaskTable from '../components/TaskTable';
import TaskFilters from '../components/TaskFilters';
import TaskDialog from '../components/TaskDialog';
import { Plus, Grid3X3, List, BarChart3, Users, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { token } = useSelector((state) => state.auth.token);
  const [openCreate, setOpenCreate] = useState(false);
  const [filters, setFilters] = useState({ priority: '', dueDate: '', status: '', search: '' });
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (token) {
      dispatch(fetchTasksAsync(token));
    }
  }, [token, dispatch]);

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    const matchesPriority = filters.priority ? task.priority === filters.priority : true;
    const matchesDueDate = filters.dueDate ? 
      new Date(task.dueDate).toISOString().split('T')[0] === filters.dueDate : true;
    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesSearch = filters.search ? 
      task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
      (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase())) : true;
    
    return matchesPriority && matchesDueDate && matchesStatus && matchesSearch;
  });

  // Stats calculations
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'complete').length,
    pending: tasks.filter(task => task.status === 'incomplete').length,
    highPriority: tasks.filter(task => task.priority === 'high' && task.status === 'incomplete').length
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-6 border border-opacity-20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Task Management
              </h1>
              <p className="text-gray-600 text-lg">
                Organize, prioritize, and track your work efficiently
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setOpenCreate(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BarChart3}
            title="Total Tasks"
            value={stats.total}
            color="text-blue-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={CheckCircle2}
            title="Completed"
            value={stats.completed}
            color="text-green-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={Clock}
            title="In Progress"
            value={stats.pending}
            color="text-orange-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={AlertTriangle}
            title="High Priority"
            value={stats.highPriority}
            color="text-red-600"
            bgColor="bg-white"
          />
        </div>

        {/* Filters */}
        <div className="mb-8">
          <TaskFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Tasks Display */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <TaskTable 
            filteredTasks={filteredTasks} 
            viewMode={viewMode}
          />
        </div>

        {/* Create Task Dialog */}
        <TaskDialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          mode="create"
        />
      </div>
    </div>
  );
};

export default Tasks;