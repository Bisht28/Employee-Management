const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Login = require('../models/Login');
const { validateLogin, checkValidationResult } = require('../middleware/validate');

router.post('/login', validateLogin, checkValidationResult, async (req, res) => {
  const { f_userName, f_Pwd } = req.body;

  try {
    const user = await Login.findOne({ f_userName });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    res.json({ message: 'Login successful', user: { f_userName: user.f_userName } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;