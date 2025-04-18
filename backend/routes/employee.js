const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');
const { validateEmployee, checkValidationResult } = require('../middleware/validate');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: Images only (jpg, png)!');
  },
});

router.post('/create', upload.single('f_Image'), validateEmployee, checkValidationResult, async (req, res) => {
  const { f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
  const f_Image = req.file ? req.file.path : '';

  try {
    const employee = new Employee({
      f_Id,
      f_Name,
      f_Email,
      f_Mobile,
      f_Designation,
      f_gender,
      f_Course: JSON.parse(f_Course),
      f_Image,
    });

    await employee.save();
    res.json({ message: 'Employee created successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'f_Name', order = 'asc', page = 1, limit = 10 } = req.query;
    const query = search ? {
      $or: [
        { f_Name: { $regex: search, $options: 'i' } },
        { f_Email: { $regex: search, $options: 'i' } },
      ],
    } : {};

    const employees = await Employee.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const totalCount = await Employee.countDocuments(query);

    res.json({ totalCount, employees });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update', upload.single('f_Image'), validateEmployee, checkValidationResult, async (req, res) => {
  const { f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
  const f_Image = req.file ? req.file.path : req.body.f_Image;

  try {
    const employee = await Employee.findOneAndUpdate(
      { f_Id },
      { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course: JSON.parse(f_Course), f_Image },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ f_Id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/status/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne({ f_Id: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.f_Status = employee.f_Status === 'Active' ? 'Deactive' : 'Active';
    await employee.save();
    res.json({ message: 'Employee status updated', employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;