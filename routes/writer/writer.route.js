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
                layout: 'main_writer.hbs',
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
                writerId: res.locals.authUser.UserID,
                trangThai: 'Chưa được duyệt',
                premium: req.body.cbPremium == 1 ? 1 : 0
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
    postModel.allByWriter(res.locals.authUser.UserID)
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
                layout: 'main_writer.hbs',
                listPost: rows
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })

})

router.get('/edit/:post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Writer') {
        throw new Error('You do not have permission to access this link')
    }
    var idPost = req.params.post
    console.log(`IDPOST la ${idPost}`)
    categoryModel.allTag()
        .then(rows => {
            postModel.single(idPost)
                .then(rowsPost => {
                    console.log(rowsPost)
                    rows.forEach(e => {
                        if (e.CatID == rowsPost[0].CatID) {
                            e.isSelected = true
                        }
                    });
                    res.render('writer/edit', {
                        layout: 'main_writer.hbs',
                        listCat: rows,
                        info: rowsPost[0]
                    })
                })
                .catch(err => {
                    console.log(err)
                })

        })
        .catch(err => {
            console.log(err)
            next()
        })

})

router.post('/edit/:post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Writer') {
        throw new Error('You do not have permission to access this link')
    }
    var idPost = req.params.post

    categoryModel.single(req.body.selectCatID)
        .then(rows => {
            var idate = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            var entity = {
                PostID: idPost,
                image_link: req.body.image_link,
                title: req.body.title,
                moTaNgan: req.body.moTaNgan,
                catId: rows[0].CatFather,
                tagId: req.body.selectCatID,
                date: idate,
                content: req.body.txtContent,
                views: 1,
                writerId: res.locals.authUser.UserID,
                trangThai: 'Chưa được duyệt'
            }
            postModel.update(entity)
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
module.exports = router;