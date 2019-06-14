var express = require('express');
var router = express.Router();

var auth = require('../../middlewares/auth')

var categoryModel = require('../../models/category.model');

// ============ Màn hình chủ ============ //
router.get('/', auth, (req, res) => {
    res.end('Man hinh chu cua admin')
})

// ============ Quản lý danh mục ============ //

router.get('/categories/', auth, (req, res) => {
    categoryModel.allParent().then(rows => {
        res.render('admin/vwCategories/index', {
            categories: rows
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/categories/edit/:id', auth, (req, res) => {

    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwCategories/edit', {
            error: true,
        })
    }
    else {
        console.log(id)
        categoryModel.single(id)
            .then(rows => {
                if (rows.length > 0) {
                    res.render('admin/vwCategories/edit', {
                        error: false,
                        category: rows[0]
                    })
                }
                else {
                    res.render('admin/vwCategories/edit', {
                        error: true,
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
    // res.end("Add new category")
    res.render('admin/vwCategories/add')
})

router.post('/categories/add', (req, res) => {
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
    categoryModel.update(req.body)
        .then(n => {
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/categories/delete', auth, (req, res) => {
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