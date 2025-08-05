// TaskTable.jsx - Modern Task Display Component
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskAsync, updateTaskAsync } from '../redux/slices/taskSlice';
import { 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Flag, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User
} from 'lucide-react';
import TaskDialog from './TaskDialog';

const TaskTable = ({ filteredTasks, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);
  const { token } = useSelector((state) => state.auth.token);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(viewMode === 'grid' ? 9 : 10);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleOpenEdit = (task) => {
    setCurrentTask(task);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTaskAsync({ id, token })).unwrap();
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleMarkComplete = async (task) => {
    try {
      await dispatch(updateTaskAsync({
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: 'complete',
        token
      })).unwrap();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'complete' ? 
      <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
      <Clock className="w-5 h-5 text-orange-500" />;
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-600', bg: 'bg-red-100' };
    if (diffDays <= 7) return { text: `${diffDays}d left`, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { text: date.toLocaleDateString(), color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const paginatedTasks = filteredTasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

  // Grid View Component
  const GridView = () => (
    <div className="p-6">
      {paginatedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">Try adjusting your filters or create a new task</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedTasks.map((task) => {
            const dueDateInfo = formatDueDate(task.dueDate);
            return (
              <div
                key={task._id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {task.title}
                      </h3>
                    </div>
                    <div className="relative">
                      <button className="p-1 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {task.description || 'No description provided'}
                  </p>
                  
                  {/* Priority and Due Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)}
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <div className={`flex items-center text-xs px-2 py-1 rounded-full ${dueDateInfo.bg} ${dueDateInfo.color}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {dueDateInfo.text}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        disabled={loading}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {task.status !== 'complete' && (
                        <button
                          onClick={() => handleMarkComplete(task)}
                          disabled={loading}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as complete"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={loading}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {task.status === 'complete' ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Task</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedTasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your filters or create a new task</p>
              </td>
            </tr>
          ) : (
            paginatedTasks.map((task) => {
              const dueDateInfo = formatDueDate(task.dueDate);
              return (
                <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {task.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {task.dueDate ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dueDateInfo.bg} ${dueDateInfo.color}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {dueDateInfo.text}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {getPriorityIcon(task.priority)} {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'complete' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {task.status === 'complete' ? '✅ Complete' : '⏳ Incomplete'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(task)}
                        disabled={loading}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {task.status !== 'complete' && (
                        <button
                          onClick={() => handleMarkComplete(task)}
                          disabled={loading}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as complete"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={loading}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredTasks.length)} of {filteredTasks.length} tasks
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handleChangePage(i)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === i
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewMode === 'grid' ? <GridView /> : <ListView />}
      <Pagination />
      
      {currentTask && (
        <TaskDialog
          open={openEdit}
          onClose={() => {
            setOpenEdit(false);
            setCurrentTask(null);
          }}
          mode="edit"
          task={currentTask}
        />
      )}
    </>
  );
};

export default TaskTable;