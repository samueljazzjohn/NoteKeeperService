var express = require('express');

const router = express.Router();

router.get('/welcome', async (req, res) => {
    try {
      res.send("Welcome to notekeeper Server")
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

  module.exports = router;
