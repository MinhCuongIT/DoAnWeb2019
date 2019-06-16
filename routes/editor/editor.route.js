var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model')
var categoryModel = require('../../models/category.model')
var auth = require('../../middlewares/auth')


router.get('/', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Editor') {
        throw new Error('You do not have permission to access this link')
    }
    postModel.allWithWriter()
        .then(rows => {

            rows.forEach(e => {
                if (e.trangThai == 'Chưa được duyệt') {
                    e.active = true
                }
            });

            res.render('editor/index', {
                layout: 'main_2.hbs',
                listPost: rows
            })
        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/accept/:post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Editor') {
        throw new Error('You do not have permission to access this link')
    }
    var postId = req.params.post
    var userId = res.locals.authUser.UserID

    postModel.acceptByPostID(postId, userId)
        .then(id => {
            res.redirect('/editor')
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/decline/:post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Editor') {
        throw new Error('You do not have permission to access this link')
    }

    var postId = req.params.post
    var userId = res.locals.authUser.UserID

    postModel.declineByPostID(postId, userId)
        .then(id => {
            res.redirect('/editor')
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/viewmypost', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Editor') {
        throw new Error('You do not have permission to access this link')
    }
    postModel.allByEditor(res.locals.authUser.UserID)
    .then(rows=>{

        rows.forEach(e => {
            if (e.trangThai == 'Đã được duyệt') {
                e.showOk = true
            }
            else{
                e.showOk = false
            }
        });

        res.render('editor/viewMyPost', {
            layout: 'main_2.hbs',
            listPost: rows
        })
    })
    .catch(err=>{
        console.log(err)
    })

})
module.exports = router;