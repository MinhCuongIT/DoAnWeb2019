var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars')
var auth = require('../../middlewares/auth')

var categoryModel = require('../../models/category.model');
var accountManageModel = require('../../models/user.model');
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
router.get('/categories/add', (req, res) => { 
    
    categoryModel.allParent().then(rows => {
        console.log(rows)
       // res.json(rows)
       res.render('admin/vwCategories/add', {
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

        CatFather:req.body.CatParent
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

router.get('/accountManage', auth, (req, res) => {
    
    accountManageModel.all().then(rows => {
        res.render('admin/vwaccountManage/index', {
            accountManage: rows
        })
    }).catch(err => {
        console.log(err)
    })
})
router.get('/accountManage/add', (req, res) => { 
    
    accountManageModel.all().then(rows => {
        console.log(rows)
       // res.json(rows)
       res.render('admin/vwaccountManage/add', {
        accountManage: rows
       })
   }).catch(err => {
       console.log(err)
   })

   
})
router.get('/accountManage/edit/:id', auth, (req, res) => {

    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwaccountManage/edit', {
            error: true,
        })
    }
    else {
        console.log(id)
        accountManageModel.single(id)
            .then(rows => {
                if (rows.length > 0) {
                    res.render('admin/vwaccountManage/edit', {
                        error: false,
                        accountManage: rows[0]
                    })
                }
                else {
                    res.render('admin/vwaccountManage/edit', {
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

router.get('/accountManage/add', auth, (req, res) => {
    // res.end("Add new category")
    res.render('admin/vwaccountManage/add')
})

// router.post('/accountManage/add', (req, res) => {
//     // console.log(req.body)
//     // res.end('...')

//     accountManageModel.add({
//         CatName:req.body.CatName,

//         CatFather:req.body.CatParent
//     })
//         .then(id => {
//             console.log(`insertId: ${id}`)
//             res.redirect('/admin/categories')
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

router.post('/accountManage/update', auth, (req, res) => {
    accountManageModel.update(req.body)
        .then(n => {
            res.redirect('/admin/accountManage')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/accountManage/delete', auth, (req, res) => {
    accountManageModel.delete(req.body.id)
        .then(n => {
            res.redirect('/admin/accountManage')
        })
        .catch(err => {
            console.log(err)
        })
})


 
 Handlebars.registerHelper("TrangThai", function(currentValue){
     if(currentValue == '1'){
         return "Active"
     }
     else
     {
         return "Block"
     }
 })
 Handlebars.registerHelper("Mau", function(currentValue){
     if(currentValue =='1'){
         return "alert-danger"
     }else{
        return "alert-success"
     }
     
 })
 Handlebars.registerHelper("Dong", function(currentValue){
    if(currentValue =='1'){
        return "alert-danger"
    }else{
       return "alert-success"
    }
 })
module.exports = router;