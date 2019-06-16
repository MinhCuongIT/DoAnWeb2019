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
                moTaNgan: req.body.moTaNgan,
                catId: rows[0].CatFather,
                tagId: req.body.selectCatID,
                date: idate,
                content: req.body.txtContent,
                views: 78,
                writerId: res.locals.authUser.id,
                trangThai: 'Chưa được duyệt'
            }
            postModel.add(entity)
                .then(id => {
                    res.redirect('/writer/viewpost')
                })
                .catch(err => {
                    console.log(err)
                })
        }).catch(err => {
            console.log(err)
            next()
        })
})

router.get('/viewpost', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Writer') {
        throw new Error('You do not have permission to access this link')
    }
    //kiểm tra bài viết từ chối hoặc chưa được duyệt thì mới được hiệu chỉnh
    postModel.allByWriter(res.locals.authUser.id)
        .then(rows => {
            // for (const r in rows) {
            //     console.log(r)
            //     if (r.trangThai === 'Đã được duyệt' || r.trangThai === 'Bị từ chối') {
            //         r.isActive = true;
            //     }
            // }
            rows.forEach(e => {
                if (e.trangThai == 'Chưa được duyệt' || e.trangThai == 'Bị từ chối') {
                    e.active = true
                }
            });
            res.render('writer/viewPost', {
                layout: 'main_2.hbs',
                listPost: rows
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })

})

module.exports = router;