var express = require('express');
var router = express.Router();

var auth = require('../../middlewares/auth')

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
    res.render('admin/vwCategories/add',{
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
        CatName:req.body.CatName,
        CatFather:0
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

// ============ Quản lý Tài khoản ============ //

module.exports = router;