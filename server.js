// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

//   const { MongoClient } = require('mongodb');
// const mongoose = require('mongoose');
const fs = require('fs');
const DataPoint = require('./models/DataPoint'); // Make sure the path is correct

// MongoDB connection URL
const mongoUrl = process.env.MONGO_URL;
// Read JSON data
const jsonData = JSON.parse(fs.readFileSync('jsondata.json', 'utf8'));

// Connect to MongoDB and insert data
(async function() {
    try {
        await mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
        
        // Insert data
        // await DataPoint.insertMany(jsonData);
        // console.log('Data successfully loaded');

    } catch (err) {
        console.error('Error connecting to MongoDB or inserting data', err);
    }
})();

  

// Example route
app.get('/', (req, res) => res.send('API Running'));


// server.js
// Add this line before the app.listen() call
// app.use('/api/datapoints', require('./routes/api/datapoints'));
app.use('/api/data', require('./routes/api/datapoints'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
