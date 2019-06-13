var express = require('express');
var router = express.Router();

var postModel = require('../models/post.model');

router.get('/:id', (req, res, next) => {


    // throw new Error('This is an error for test!')

    var id = req.params.id
    if (isNaN(id)) {
        throw new Error('Id is not a number!')
    }
    postModel.single(id)
    .then(rows=>{
        res.render('vwProducts/viewDetail',{
            danhMuc:rows[0].CatName,
            post:rows[0]
        })
    })
    .catch(err=>{
        console.log(err)
        next()
    })

})


module.exports = router;