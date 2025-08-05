import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createTask, deleteTask, updateTask, fetchTasks } from '../api/taskApi';

export const createTaskAsync = createAsyncThunk('tasks/createTask', async ({ title, description, dueDate, priority, token }) => {
  const response = await createTask(title, description, dueDate, priority, token);
  return response.task;
});

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async ({ id, token }) => {
  await deleteTask(id, token);
  return id;
});

export const updateTaskAsync = createAsyncThunk('tasks/updateTask', async ({ id, title, description, dueDate, priority, status, token }) => {
  const response = await updateTask(id, title, description, dueDate, priority, status, token);
  return response.task;
});

export const fetchTasksAsync = createAsyncThunk('tasks/fetchTasks', async (token) => {
  const response = await fetchTasks(token);
  return response.tasks;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;