var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.end('Trang editor')
})

module.exports = router;