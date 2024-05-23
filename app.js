// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const session = require('express-session');
const WebSocket=require('ws');
const db = require('./database');
const mariadb = require('mariadb');
const app = express();
const PORT = process.env.PORT || 3001;
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 100000,
});
//Create a Websocket server completely detached from the HTTP Server
const wss=new WebSocket.Server({port:8181});
const wsSelected=new Set();
wss.on('connection', function connection(ws){
  wsSelected.add(ws);
 // console.log('Client Connecting....');
  
  ws.on('message', function incoming(message){
    wsSelected.forEach(function each(client) {
     // console.log(client.readyState);
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Echo:${message}`);
      }
    })
    console.log('received:%s',message);
  
// Parse the JSON string
const parsedData = JSON.parse(message);
const topicName=parsedData.topicName;
if (topicName.toLowerCase() === "heartrate") {
  const clientId = parsedData.deviceName;
  const heartRate = parsedData.heartRate;
  const timestamp = parsedData.timestamp;
    pool.getConnection()
    .then(conn =>{
      conn.query('USE wearable_db')
         .then(conn.query('INSERT INTO fitbit_data (clientId, timestamp, heartRate) VALUES (?, ?, ?)', [
          clientId,
          timestamp,
          heartRate,
        ]))})
        .catch (error => {
        console.error('Error adding versa-2 data:', error);
        
      });
}
if (topicName.toLowerCase() === 'accelerometer') {
  const clientId = parsedData.deviceName;
  const accX = parsedData.accelerometerData.x;
  const accY = parsedData.accelerometerData.y;
  const accZ = parsedData.accelerometerData.z;
  const timestamp = parsedData.timestamp;
    pool.getConnection()
    .then(conn =>{
      conn.query('USE wearable_db')
         .then(conn.query('INSERT INTO fitbit_accelerometer (clientId, accX,accY,accZ, timestamp) VALUES (?, ?, ?,?,?)', [
          clientId,
          accX,
          accY,
          accZ,
          timestamp,
        ]))})
        .catch (error => {
        console.error('Error adding versa data:', error);
        
      });
}
if (topicName.toLowerCase() === 'location') {
  const clientId = parsedData.deviceName;
  const latitude = parsedData.latitude;
  const longitude = parsedData.longitude;
  const timestamp = parsedData.timestamp;
    pool.getConnection()
    .then(conn =>{
      conn.query('USE wearable_db')
         .then(conn.query('INSERT INTO fitbit_location (clientId, latitude,longitude, timestamp) VALUES (?, ?, ?,?)', [
          clientId,
          latitude,
          longitude,
          timestamp,
        ]))})
        .catch (error => {
        console.error('Error adding versa data:', error);
        
      });
}
ws.send(`Echo: ${message}`);
});
});
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  }));
  
  // Set up middleware to parse request bodies
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());



app.use('/', routes);

app.listen(PORT, (req, res) => {
  console.log(`App is running on port ${PORT}`);
});