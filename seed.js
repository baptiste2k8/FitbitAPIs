const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 10,
});

const users = [
  {
    userName: 'Administrator',
    userEmail: 'baptiste2k17@gmail.com',
    userPassword: 'password123',
    userAge: 22,
  },
  {
    userName: 'Jean Baptiste M',
    userEmail: 'baptiste2k8@gmail.com',
    userPassword: 'password456',
    userAge: 21,
  },
  {
    userName: 'Enos Mukiza',
    userEmail: 'mukizaenos@gmail.com',
    userPassword: 'password789',
    userAge: 22,
  },
];

const actions = [
  {
    receivedOn: '2024-04-04 18:30:25',
    buddyPayload: 'move/0.2/0.4',
    buddyPayloadExecutionStatus: null,
    buddyPayloadExecutionOutcome: null,
    triggeringEvent: null,
  }, 
];
async function createDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS buddy_db');
    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createUserTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userUniqueId INT NOT NULL AUTO_INCREMENT,
        userName VARCHAR(255),
        userEmail VARCHAR(255),
        userPassword VARCHAR(255),
        userAge INT,
        CONSTRAINT user_pk PRIMARY KEY (userUniqueId)

      )
    `);
    console.log('Users table created successfully.');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function createBuddyTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS buddy_actions (
        uniqueID INT NOT NULL AUTO_INCREMENT,
        receivedOn DATETIME, 
        buddyPayload VARCHAR(255),
        buddyPayloadExecutionStatus VARCHAR(255),
        buddyPayloadExecutionOutcome VARCHAR(255),
        triggeringEvent VARCHAR(50),
        CONSTRAINT buddy_pk PRIMARY KEY (uniqueID)
      )
    `);
    console.log('Buddy table created successfully.');
  } catch (error) {
    console.error('Error creating Buddy table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedUsers() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query('DELETE FROM users');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.userPassword, 10);
      await connection.query('INSERT INTO users (userName, userEmail, userPassword, userAge) VALUES (?, ?, ?, ?)', [
        user.userName,
        user.userEmail,
        hashedPassword,
        user.userAge,
      ]);
    }

    console.log('Users table seeded successfully.');
  } catch (error) {
    console.error('Error seeding users table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedbuddy() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query('DELETE FROM buddy_actions');

    for (const action of actions) {
      await connection.query('INSERT INTO buddy_actions (receivedOn,buddyPayload, buddyPayloadExecutionStatus, buddyPayloadExecutionOutcome,triggeringEvent) VALUES (?, ?, ?, ?, ?)', [
        action.receivedOn,
        action.buddyPayload,
        action.buddyPayloadExecutionStatus,
        action.buddyPayloadExecutionOutcome,
        action.triggeringEvent,
      ]);
    }
    console.log('Buddy table seeded successfully.');
  } catch (error) {
    console.error('Error seeding buddy table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedDatabase() {
  await createDatabase();
  await createUserTable();
  await createBuddyTable();
  await seedUsers();
  await seedbuddy();
  pool.end();
}

seedDatabase();