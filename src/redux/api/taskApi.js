export const createTask = async (title, description, dueDate, priority, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, dueDate, priority }),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to create task');
  }
};

export const deleteTask = async (id, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to delete task');
  }
};

export const updateTask = async (id, title, description, dueDate, priority, status, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, dueDate, priority, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update task');
  }
};

export const fetchTasks = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};