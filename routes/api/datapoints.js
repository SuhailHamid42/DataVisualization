const express = require('express');
const router = express.Router();
const Data = require('../../models/DataPoint');

// @route GET api/data
// @desc Get all data or filter data
router.get('/', async (req, res) => {
  try {
    const query = {};
    
    if (req.query.end_year) {
      query.end_year = req.query.end_year;
    }
    if (req.query.topic) {
      query.topic = req.query.topic;
    }
    if (req.query.sector) {
      query.sector = req.query.sector;
    }
    if (req.query.region) {
      query.region = req.query.region;
    }
    if (req.query.pestle) {
      query.pestle = req.query.pestle;
    }
    if (req.query.source) {
      query.source = req.query.source;
    }
    if (req.query.country) {
      query.country = req.query.country;
    }
    if (req.query.city) {
      query.city = req.query.city;
    }

    const data = await Data.find(query);
    res.send(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server Error: ' + err.message);
  }
});

module.exports = router;
