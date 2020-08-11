var express = require('express');


var router = express.Router();
router.get('/', function(req, res) {
    return res.json({ "hi": "bye" });
});

module.exports = router;