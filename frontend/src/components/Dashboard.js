import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-container">
      <header>
        <div className="logo">Logo</div>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/employee-list">Employee List</Link>
          <span>{user.f_userName} - </span>
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>
      <h2>Welcome Admin Panel</h2>
    </div>
  );
};

export default Dashboard;