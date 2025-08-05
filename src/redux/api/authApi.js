export const signupUser = async (name, email, password) => {
  try {
    const response = await fetch('https://assignment-backend-urtz.onrender.com/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to sign up');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to sign up');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch('https://assignment-backend-urtz.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Failed to log in');
    }
    const data = await response.json();
    return { token: data.token, userId: data.userId, email, name: data.name, role: data.role };
  } catch (error) {
    throw new Error('Failed to log in');
  }
};