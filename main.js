const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect();

// Insecure login route
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Vulnerable SQL query
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Database error');
      return;
    }

    if (results.length > 0) {
      res.send('Login successful');
    } else {
      res.send('Invalid credentials');
    }
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
