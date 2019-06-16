var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model')
var userModel = require('../../models/user.model')
var auth = require('../../middlewares/auth')
var moment = require('moment')
var categoryModel = require('../../models/category.model');

// ============ Màn hình chủ ============ //
// router.get('/', auth, (req, res) => {
//     res.end('Man hinh chu cua admin')
// })

// ============ Quản lý danh mục ============ //

router.get('/categories/', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.allParent().then(rows => {
        res.render('admin/vwCategories/index', {
            categories: rows,
            layout: 'main_2.hbs'
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/categories/edit/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwCategories/edit', {
            error: true,
            layout: 'main_2.hbs'
        })
    }
    else {
        console.log(id)
        categoryModel.single(id)
            .then(rows => {
                if (rows.length > 0) {
                    res.render('admin/vwCategories/edit', {
                        error: false,
                        category: rows[0],
                        layout: 'main_2.hbs'
                    })
                }
                else {
                    res.render('admin/vwCategories/edit', {
                        error: true,
                        layout: 'main_2.hbs'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.end("Co loi xay ra!")
            })
    }

})

router.get('/categories/add', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    // res.end("Add new category")
    res.render('admin/vwCategories/add', {
        layout: 'main_2.hbs'
    })
})

router.post('/categories/add', (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    // console.log(req.body)
    // res.end('...')

    categoryModel.add({
        CatName: req.body.CatName,
        CatFather: 0
    })
        .then(id => {
            console.log(`insertId: ${id}`)
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/categories/update', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.update(req.body)
        .then(n => {
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/categories/delete', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.delete(req.body.CatID)
        .then(n => {
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})

// ============ Quản lý tag ============ //

// ============ Quản lý xuất bản bài post ============ //
router.get('/post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    postModel.allToPublish()
        .then(rows => {
            res.render('admin/vwPosts/index', {
                layout: 'main_2.hbs',
                listPost: rows,
            })
        }).catch(err => {
            console.log(err)
        })
})

router.post('/post/:post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    var postId = req.params.post
    postModel.publish(postId)
        .then(id => {
            res.redirect('/admin/post')
        })
        .catch(err => {
            console.log(err)
        })
})
// ============ Quản lý Tài khoản ============ //

// ============ Quản lý phân quyên cho editor ============ //
router.get('/role', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    userModel.allEditor()
        .then(rowsE => {
            categoryModel.allTag()
                .then(rowsT => {
                    res.render('admin/vwAccounts/phanQuyen', {
                        layout: 'main_2.hbs',
                        users: rowsE,
                        cats: rowsT
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/role', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    if (isNaN(req.body.selectUser) || isNaN(req.body.selectCat)) {
        res.render('admin/vwAccounts/fail', {
            layout: 'main_2.hbs'
        })
    }
    else {
        userModel.setRole(req.body.selectUser, req.body.selectCat)
            .then(id => {
                res.render('admin/vwAccounts/success', {
                    layout: 'main_2.hbs'
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
})
// ============ Quản lý Gia Han ============ //
router.get('/renewal', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    userModel.allSubscriber()
        .then(rowsS => {
            res.render('admin/vwAccounts/giaHan', {
                layout: 'main_2.hbs',
                users: rowsS,
            })
        })
        .catch(err => {
            console.log(err)
        })
})
router.post('/renewal', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    if (isNaN(req.body.selectUser)) {
        res.render('admin/vwAccounts/giaHanFail', {
            layout: 'main_2.hbs'
        })
    }
    else {
        var now = moment();
        var to = moment().add(7, 'days');
        userModel.renewal(req.body.selectUser, to.format('YYYY-MM-DD'))
        .then(id=>{
            res.render('admin/vwAccounts/giaHanSuccess', {
                layout: 'main_2.hbs',
                toDate: to.format('DD/MM/YYYY')
            })
        })
    }
})
module.exports = router;