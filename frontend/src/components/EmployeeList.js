import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = ({ user, onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('f_Name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/employees`, {
          params: { search, sortBy, order, page, limit },
        });
        setEmployees(res.data.employees);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, [search, sortBy, order, page]);

  const handleStatusToggle = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/employees/status/${id}`);
      setEmployees(employees.map(emp => 
        emp.f_Id === id ? { ...emp, f_Status: emp.f_Status === 'Active' ? 'Deactive' : 'Active' } : emp
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/employees/${id}`);
        setEmployees(employees.filter(emp => emp.f_Id !== id));
        setTotalCount(totalCount - 1);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="employee-list-container">
      <header>
        <div className="logo">Logo</div>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/employee-list">Employee List</Link>
          <span>{user.f_userName} - </span>
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>
      <h2>Employee List</h2>
      <div>
        <p>Total Count: {totalCount}</p>
        <Link to="/create-employee">Create Employee</Link>
        <input
          type="text"
          placeholder="Enter Search Keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => { setSortBy('f_Id'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>Unique Id</th>
            <th>Image</th>
            <th onClick={() => { setSortBy('f_Name'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>Name</th>
            <th onClick={() => { setSortBy('f_Email'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th onClick={() => { setSortBy('f_Createdate'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>Create Date</th>
            <th>Action</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.f_Id}>
              <td>{emp.f_Id}</td>
              <td>{emp.f_Image ? <img src={`${process.env.REACT_APP_API_URL}/${emp.f_Image}`} alt="employee" width="50" /> : '-'}</td>
              <td>{emp.f_Name}</td>
              <td>{emp.f_Email}</td>
              <td>{emp.f_Mobile}</td>
              <td>{emp.f_Designation}</td>
              <td>{emp.f_gender}</td>
              <td>{emp.f_Course.join(', ')}</td>
              <td>{new Date(emp.f_Createdate).toLocaleDateString()}</td>
              <td>
                <Link to={`/edit-employee/${emp.f_Id}`}>Edit</Link> - 
                <button onClick={() => handleDelete(emp.f_Id)}>Delete</button>
              </td>
              <td>
                <button onClick={() => handleStatusToggle(emp.f_Id)}>
                  {emp.f_Status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)} disabled={page * limit >= totalCount}>Next</button>
      </div>
    </div>
  );
};

export default EmployeeList;