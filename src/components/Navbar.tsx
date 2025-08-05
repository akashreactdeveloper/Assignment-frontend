// components/NavBar.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.token); // adjust if nested

  const handleLogout = () => {
    dispatch({
      type: 'logout',
    });
    localStorage.removeItem('persist:root');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.heading}>Task Manager</h2>
      <div style={styles.right}>
        <span style={styles.username}>Welcome, {user?.name || 'User'}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
  },
  heading: {
    margin: 0,
    fontSize: '1.5rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '1rem',
  },
  logoutBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: '#e74c3c',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default NavBar;
