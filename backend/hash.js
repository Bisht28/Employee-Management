const bcrypt = require('bcryptjs');
const password = 'password123'; // Replace with your desired password
console.log(bcrypt.hashSync(password, 10));