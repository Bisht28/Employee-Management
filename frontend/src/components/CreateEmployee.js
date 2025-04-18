import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const CreateEmployee = ({ user, onLogout }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    f_Id: '',
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: 'HR',
    f_gender: 'M',
    f_Course: [],
    f_Image: null,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.f_Id) newErrors.f_Id = 'ID is required';
    if (!formData.f_Name) newErrors.f_Name = 'Name is required';
    if (!formData.f_Email || !/\S+@\S+\.\S+/.test(formData.f_Email)) newErrors.f_Email = 'Valid email is required';
    if (!formData.f_Mobile || !/^\d{10}$/.test(formData.f_Mobile)) newErrors.f_Mobile = 'Valid 10-digit mobile is required';
    if (!formData.f_Image || !['image/jpeg', 'image/png'].includes(formData.f_Image?.type)) newErrors.f_Image = 'Only jpg/png files allowed';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'f_Course') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key === 'f_Image' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/employees/create`, formDataToSend);
      history.push('/employee-list');
    } catch (err) {
      setErrors({ api: err.response?.data?.errors?.map(e => e.msg).join(', ') || 'Server error' });
    }
  };

  const handleCourseChange = (e) => {
    const course = e.target.value;
    setFormData({
      ...formData,
      f_Course: e.target.checked
        ? [...formData.f_Course, course]
        : formData.f_Course.filter(c => c !== course),
    });
  };

  return (
    <div className="create-employee-container">
      <header>
        <div className="logo">Logo</div>
        <nav>
          <Link to="/dashboard">Home</Link>
          <Link to="/employee-list">Employee List</Link>
          <span>{user.f_userName} - </span>
          <button onClick={onLogout}>Logout</button>
        </nav>
      </header>
      <h2>Create Employee</h2>
      {errors.api && <p className="error">{errors.api}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID</label>
          <input
            type="number"
            value={formData.f_Id}
            onChange={(e) => setFormData({ ...formData, f_Id: e.target.value })}
          />
          {errors.f_Id && <p className="error">{errors.f_Id}</p>}
        </div>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={formData.f_Name}
            onChange={(e) => setFormData({ ...formData, f_Name: e.target.value })}
          />
          {errors.f_Name && <p className="error">{errors.f_Name}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={formData.f_Email}
            onChange={(e) => setFormData({ ...formData, f_Email: e.target.value })}
          />
          {errors.f_Email && <p className="error">{errors.f_Email}</p>}
        </div>
        <div>
          <label>Mobile No</label>
          <input
            type="text"
            value={formData.f_Mobile}
            onChange={(e) => setFormData({ ...formData, f_Mobile: e.target.value })}
          />
          {errors.f_Mobile && <p className="error">{errors.f_Mobile}</p>}
        </div>
        <div>
          <label>Designation</label>
          <select
            value={formData.f_Designation}
            onChange={(e) => setFormData({ ...formData, f_Designation: e.target.value })}
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label>Gender</label>
          <input
            type="radio"
            name="f_gender"
            value="M"
            checked={formData.f_gender === 'M'}
            onChange={(e) => setFormData({ ...formData, f_gender: e.target.value })}
          /> Male
          <input
            type="radio"
            name="f_gender"
            value="F"
            checked={formData.f_gender === 'F'}
            onChange={(e) => setFormData({ ...formData, f_gender: e.target.value })}
          /> Female
        </div>
        <div>
          <label>Course</label>
          <input
            type="checkbox"
            value="MCA"
            checked={formData.f_Course.includes('MCA')}
            onChange={handleCourseChange}
          /> MCA
          <input
            type="checkbox"
            value="BCA"
            checked={formData.f_Course.includes('BCA')}
            onChange={handleCourseChange}
          /> BCA
          <input
            type="checkbox"
            value="BSC"
            checked={formData.f_Course.includes('BSC')}
            onChange={handleCourseChange}
          /> BSC
        </div>
        <div>
          <label>Image Upload</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setFormData({ ...formData, f_Image: e.target.files[0] })}
          />
          {errors.f_Image && <p className="error">{errors.f_Image}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEmployee;