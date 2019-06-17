var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model')
var auth = require('../../middlewares/auth')

router.get('/', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Subscriber') {
        throw new Error('You do not have permission to access this link')
    }
    var page = req.query.page || 1
    if (page < 1) {
        page = 1
    }
    var limit = 10
    var offset = (page - 1) * limit
    Promise.all([
        postModel.pageByPremium(limit, offset),
        postModel.countByPremium(),
    ])
        .then(([rows, count_rows]) => {

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
            res.render('subscriber/premiumPost', {
                layout: 'main_2.hbs',
                products: rows,
                pages
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })

})
router.get('/view/:post', auth, (req, res) => {
    var idPost = req.params.post
    postModel.singlePremium(idPost)
        .then(rows => {
            res.render('subscriber/premiumPostDetail', {
                layout: 'main_2.hbs',
                post:rows[0]
            })
        })
        .catch(err => {
            console.log(err)
        })

})
module.exports = router;