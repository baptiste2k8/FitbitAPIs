// routes.js

const express = require('express');
const router = express.Router();
const db = require('./database');
const bcrypt = require('bcrypt');

/*
const users = [
  {
    userName: 'Aditya Gupta',
    userEmail: 'aditya@gmail.com',
    userAge: '22',
    userUniqueId: '1',
  },
  {
    userName: 'Vanshita Jaiswal',
    userEmail: 'vanshita@gmail.com',
    userAge: '21',
    userUniqueId: '2',
  },
  {
    userName: 'Sachin Yadav',
    userEmail: 'sachin@gmail.com',
    userAge: '22',
    userUniqueId: '3',
  },
];*/

// Login route
router.get('/login1', (req, res) => {
    res.render('login1');
  });
// Login route
router.post('/login1', async (req, res) => {
    const { userEmail, userPassword } = req.body;
  
    try {
      // Check if the user exists in the database
      const results = await db.query('SELECT * FROM users WHERE userEmail = ?', [userEmail]);
  
      if (results.length === 0) {
        // User not found
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const user = results[0];
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  
      if (!passwordMatch) {
        // Passwords don't match
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Password is correct, create a session for the user
      req.session.userId = user.userUniqueId;
      req.session.userName = user.userName;
  
      //res.json({ message: 'Login successful' });
      return res.redirect('/');
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// Home route
router.get('/users', async function (req, res) {
    try {
      // Check if the user is logged in
      if (!req.session.userId) {
        // User is not logged in, redirect to the login page
        return res.redirect('/login1');
      }
  
      const users = await db.query('SELECT * FROM users');
  
      res.render('admin', {
        data: users,
        userName: req.session.userName,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.sendStatus(500);
    }
  });

// Add user route
router.post('/user/add', async (req, res) => {
  const { userName, userEmail, userAge, userUniqueId } = req.body;

  try {
    await db.query('INSERT INTO users (userUniqueId, userName, userEmail, userAge) VALUES (?, ?, ?, ?)', [
      userUniqueId,
      userName,
      userEmail,
      userAge,
    ]);
    res.redirect('/users');
  } catch (error) {
    console.error('Error adding user:', error);
    res.sendStatus(500);
  }
});

// Delete user route
router.delete('/user/delete/:userUniqueId', async (req, res) => {
  const userUniqueId = req.params.userUniqueId;

  try {
    await db.query('DELETE FROM users WHERE userUniqueId = ?', [userUniqueId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.sendStatus(500);
  }
});

// Update user route
router.put('/user/update/:userUniqueId', async (req, res) => {
  const { userName, userEmail, userAge } = req.body;
  const userUniqueId = req.params.userUniqueId;

  try {
    await db.query('UPDATE users SET userName = ?, userEmail = ?, userAge = ? WHERE userUniqueId = ?', [
      userName,
      userEmail,
      userAge,
      userUniqueId,
    ]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating user:', error);
    res.sendStatus(500);
  }
});

// Home route
router.get('/', async function (req, res) {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      // User is not logged in, redirect to the login page
      return res.redirect('/login1');
    }

    const users = await db.query('SELECT * FROM users');

    res.render('admin', {
      data: users,
      userName: req.session.userName,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.sendStatus(500);
  }
});

// ======================WIMP ENTRIES ====================================
// wimp route
router.get('/buddy_actions', async function (req, res) {
  try {
    // Check if the user is logged in
    if (!req.session.userId) {
      // User is not logged in, redirect to the login page
      return res.redirect('/login1');
    }

    const buddy_actions = await db.query('SELECT * FROM buddy_actions');

    res.render('home', {
      data: buddy_actions,
    });
  } catch (error) {
    console.error('Error fetching buddy entries:', error);
    res.sendStatus(500);
  }
});
router.get('/buddy-actions-Json', async function (req, res) {
  try {
    // Check if the user is logged in
    //if (!req.session.userId) {
      // User is not logged in, redirect to the login page
     // return res.redirect('/login1');
    //}

    const buddy_actions = await db.query('SELECT * FROM buddy_actions');

   // Set the Content-Type header to application/json
   res.setHeader('Content-Type', 'application/json');
  // Send wimps data as JSON
  res.json({
    data: buddy_actions,
  });
} catch (error) {
  console.error('Error fetching buddy_actions entry:', error);
  res.sendStatus(500);
}
});
// Add wimp route
router.post('/buddy-actions/add', async (req, res) => {
  console.log('into buddy/add');
const { uniqueID,receivedOn,buddyPayload,buddyPayloadExecutionStatus,buddyPayloadExecutionOutcome,triggeringEvent } = req.body;
try {
  await db.query('INSERT INTO buddy_actions (uniqueID, receivedOn,buddyPayload, buddyPayloadExecutionStatus, buddyPayloadExecutionOutcome,triggeringEvent) VALUES (?,?, ?, ?, ?,?)', [
  uniqueID,
  receivedOn,
  buddyPayload,
  buddyPayloadExecutionStatus,
  buddyPayloadExecutionOutcome,
  triggeringEvent,
  ]);
  res.redirect('/buddy_actions');
} catch (error) {
  console.error('Error adding buddy_action entry:', error);
  res.sendStatus(500);
}
});

// Delete wimp route
router.delete('/buddy-actions/delete/:uniqueID', async (req, res) => {
const uniqueID = req.params.uniqueID;

try {
  await db.query('DELETE FROM buddy_actions WHERE uniqueID = ?', [uniqueID]);
  res.sendStatus(200);
} catch (error) {
  console.error('Error deleting buddy entry:', error);
  res.sendStatus(500);
}
});

// Update wimp route
router.put('/buddy_actions/update/:uniqueID', async (req, res) => {
console.log('into buddy_actions/update');
const {receivedOn,buddyPayload,buddyPayloadExecutionStatus,buddyPayloadExecutionOutcome,triggeringEvent } = req.body;
const uniqueID = req.params.uniqueID;
console.log(uniqueID);
try {
  await db.query('UPDATE buddy_actions SET receivedOn = ?, buddyPayload = ?,buddyPayloadExecutionStatus=?,buddyPayloadExecutionOutcome=?,triggeringEvent=? WHERE uniqueID = ?', [
    receivedOn,
    buddyPayload,
    buddyPayloadExecutionStatus,
    buddyPayloadExecutionOutcome,
    triggeringEvent,
    uniqueID,
  ]);
  res.sendStatus(200);
} catch (error) {
  console.error('Error updating buddy_action entry:', error);
  res.sendStatus(500);
}
});

module.exports = router;