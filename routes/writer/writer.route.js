var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model')
var categoryModel = require('../../models/category.model')
var moment = require('moment')
var auth = require('../../middlewares/auth')

router.get('/', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Writer') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.allTag()
        .then(rows => {
            res.render('writer/index', {
                layout: 'main_2.hbs',
                listCat: rows
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })

})
router.post('/', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Writer') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.single(req.body.selectCatID)
        .then(rows => {
            var idate = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            var entity = {
                image_link: req.body.image_link,
                title: req.body.title,
                catId: rows[0].CatFather,
                tagId: req.body.selectCatID,
                date: idate,
                content: req.body.txtContent,
                views: 78,
                writerId: res.locals.authUser.id,
                trangThai: 2
            }
            postModel.add(entity)
                .then(id => {
                    res.end('them thanh cong!')
                })
                .catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
            next()
        })
})

module.exports = router;