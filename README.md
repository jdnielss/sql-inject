# Insecure Code (Vulnerable to SQL Injection):


```javascript
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

```

## How SQL Injection Works in This Code:

An attacker can inject SQL code via the username or password field. For example:

- Suppose the attacker enters the following in the username field: ``` admin' --```
This comment -- will ignore the rest of the query, making the SQL statement look like this:

```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = ''
```

This effectively bypasses the password check, allowing the attacker to log in as admin.

## Example of SQL Injection Attempt:

```bash
curl -X POST -d "username=admin' --&password=anything" http://localhost:3000/login
```
This request would bypass authentication and log the attacker in as the admin.

This code is vulnerable because it directly injects user input into the SQL query without sanitization or parameterization, allowing an attacker to manipulate the SQL query.