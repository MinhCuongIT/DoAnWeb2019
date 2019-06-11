var express = require('express');
var router = express.Router();

var categoryModel = require('../../models/category.model');

router.get('/', (req, res) => {
    categoryModel.all().then(rows => {
        // console.log(rows)
        // res.json(rows)
        res.render('admin/vwCategories/index', {
            categories: rows
        })
    }).catch(err => {
        console.log(err)
    })
})

router.get('/edit/:id', (req, res) => {

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

router.get('/add', (req, res) => {
    // res.end("Add new category")
    res.render('admin/vwCategories/add')
})

router.post('/add', (req, res) => {
    // console.log(req.body)
    // res.end('...')

    categoryModel.add(req.body)
        .then(id => {
            console.log(`insertId: ${id}`)
            res.render('admin/vwCategories/add')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/update', (req, res) => {
    categoryModel.update(req.body)
        .then(n => {
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/delete', (req, res) => {
    categoryModel.delete(req.body.CatID)
        .then(n => {
            res.redirect('/admin/categories')
        })
        .catch(err => {
            console.log(err)
        })
})


module.exports = router;