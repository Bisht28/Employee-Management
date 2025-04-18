import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [f_userName, setUserName] = useState('');
  const [f_Pwd, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!f_userName || !f_Pwd) {
      setError('Username and password are required');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { f_userName, f_Pwd });
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Name</label>
          <input
            type="text"
            value={f_userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={f_Pwd}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;