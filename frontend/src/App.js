import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
        </Route>
        <Route path="/dashboard">
          {user ? <Dashboard user={user} onLogout={handleLogout} /> : <Redirect to="/" />}
        </Route>
        <Route path="/employee-list">
          {user ? <EmployeeList user={user} onLogout={handleLogout} /> : <Redirect to="/" />}
        </Route>
        <Route path="/create-employee">
          {user ? <CreateEmployee user={user} onLogout={handleLogout} /> : <Redirect to="/" />}
        </Route>
        <Route path="/edit-employee/:id">
          {user ? <EditEmployee user={user} onLogout={handleLogout} /> : <Redirect to="/" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;