var express = require('express');
var router = express.Router();

var productModel = require('../models/product.model');

router.get('/:id', (req, res, next) => {


    // throw new Error('This is an error for test!')

    var id = req.params.id

    var page = req.query.page || 1
    if (page < 1) {
        page = 1
    }

    var limit = 6
    var offset = (page - 1) * limit
    if (isNaN(id)) {
        throw new Error('Id is not a number!')
    }
    else {
        Promise.all([
            productModel.pageByCat(id, limit, offset),
            productModel.countByCat(id),
        ])
            .then(([rows, count_rows]) => {
                res.locals.lcCategories.forEach(c => {
                    if (c.CatID === +id) {
                        c.isActive = true;
                    }
                });

                var total = count_rows[0].total
                var nPages = Math.floor(total / limit)
                if (total % limit > 0) {
                    nPages++
                }
                var pages = []
                for (var i = 1; i <= nPages; i++) {
                    pages.push({
                        iPage: i,
                        active: i === +page
                    })
                }

                res.render('vwProducts/byCat', {
                    products: rows,
                    pages
                })
            })
            .catch(err => {
                console.log(err)
                // res.end('Da xay ra loi!')
                next()
            })
    }


})


module.exports = router;