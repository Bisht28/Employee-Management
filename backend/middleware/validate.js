const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('f_userName').notEmpty().withMessage('Username is required'),
  body('f_Pwd').notEmpty().withMessage('Password is required'),
];

const validateEmployee = [
  body('f_Name').notEmpty().withMessage('Name is required'),
  body('f_Email').isEmail().withMessage('Invalid email').custom(async (value, { req }) => {
    const employee = await require('../models/Employee').findOne({ f_Email: value });
    if (employee && employee.f_Id !== req.body.f_Id) {
      throw new Error('Email already exists');
    }
  }),
  body('f_Mobile').isNumeric().withMessage('Mobile must be numeric').isLength({ min: 10, max: 10 }).withMessage('Mobile must be 10 digits'),
  body('f_Designation').isIn(['HR', 'Manager', 'Sales']).withMessage('Invalid designation'),
  body('f_gender').isIn(['M', 'F']).withMessage('Invalid gender'),
  body('f_Course').isArray().withMessage('Course must be an array'),
  body('f_Course.*').isIn(['MCA', 'BCA', 'BSC']).withMessage('Invalid course'),
];

const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateLogin, validateEmployee, checkValidationResult };