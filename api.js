const express = require('express');
const router = express.Router({ mergeParams: true });

const circSup = require('./api/circSup')
router.use('/circulationSupply', circSup)
router.use('/totalSupply', (req, res) => {
    res.send('8889445');
})
module.exports = router;