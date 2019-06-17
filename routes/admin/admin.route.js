var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars')
var auth = require('../../middlewares/auth')
var moment = require('moment')

var categoryModel = require('../../models/category.model');
var accountManageModel = require('../../models/user.model');
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
router.get('/categories/add', (req, res) => { 
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.allParent().then(rows => {
       // res.json(rows)
       res.render('admin/vwCategories/add', {
           categories: rows,
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
                console.log(rows[0])
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
    // console.log(req.body)
    // res.end('...')
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    categoryModel.add({
        CatName:req.body.CatName,

        CatFather:req.body.CatParent,
        
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

router.get('/accountManage', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }

    accountManageModel.all().then(rows => {
        res.render('admin/vwaccountManage/index', {
            accountManage: rows,
            layout: 'main_2.hbs'
        })
    }).catch(err => {
        console.log(err)
    })
})
   
router.get('/accountManage/GiaHan', (req, res) => { 
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    accountManageModel.allSubscriber().then(rows => {
      
       // res.json(rows)
       res.render('admin/vwaccountManage/GiaHan', {
        accountManage: rows,
        layout: 'main_2.hbs'
       })
   }).catch(err => {
       console.log(err)
   })

   
})
router.get('/accountManage/PhanCong', (req, res) => { 
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    accountManageModel.allEditor().then(rows => {
       // res.json(rows)
       res.render('admin/vwaccountManage/PhanCong', {
        accountManage: rows,
        layout: 'main_2.hbs'
       })
   }).catch(err => {
       console.log(err)
   })

   
})
router.get('/accountManage/edit/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwAccountManage/edit', {
            error: true,
            layout: 'main_2.hbs'
        })
    }
    else {
        accountManageModel.single(id)
            .then(rows => {
                if (rows.length > 0) {
                    res.render('admin/vwAccountManage/edit', {
                        error: false,
                        accountManage: rows[0],
                        layout: 'main_2.hbs'
                    })
                }
                else {
                    res.render('admin/vwAccountManage/edit', {
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

router.get('/accountManage/GiaHan', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }

    res.render('admin/vwaccountManage/GianHan')
})
router.get('/accountManage/detail/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwAccountManage/index', {
            error: true,
            layout: 'main_2.hbs'
        })
    }
    else {
        accountManageModel.single(id)
            .then(rows => {
                console.log(rows[0])
                if (rows.length > 0) {
                    res.render('admin/vwAccountManage/Detail', {
                        error: false,
                        accountManage: rows[0],
                        layout: 'main_2.hbs'
                    })
                }
                else {
                    res.render('admin/vwAccountManage/index', {
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
router.get('/accountManage/PhanCong', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    res.render('admin/vwaccountManage/PhanCong')
})
router.get('/accountManage/add', auth, (req, res) => {
    console.log("haha");
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    // res.end("Add new category")
    res.render('admin/vwAccountManage/add', {
        
        layout: 'main_2.hbs'
    })
    
})
router.post('/accountManage/add', (req, res) => {
    // console.log(req.body)
    // res.end('...')
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    console.log("ahihi")
    accountManageModel.add({
        username:req.body.username,

        password:req.body.password,
        name: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        type: req.body.rbLoai,
        status: 0,
        date_register:moment().format('YYYY-MM-DD')
        
    })
        .then(id => {
            console.log(`insertId: ${id}`)
            res.redirect('/admin/accountManage')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/accountManage/update', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    accountManageModel.update(req.body)
        .then(n => {
            res.redirect('/admin/accountManage')
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/accountManage/update/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    console.log(moment().format('YYYY-MM-DD'))
    var entity={
        UserID:req.params.id,
        date_register:moment().format('YYYY-MM-DD')

    }
   
    accountManageModel.update(entity)
  
        .then(n => {
            console.log(entity)
            res.redirect('/admin/accountManage/GiaHan')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/accountManage/delete', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    accountManageModel.delete(req.body.username)
        .then(n => {
            res.redirect('/admin/accountManage')
        })
        .catch(err => {
            console.log(err)
        })
})


 
















Handlebars.registerHelper('select', function(selected, option) {
    return (selected == option) ? 'selected="selected"' : '';
});

Handlebars.registerHelper("Button", function(currentValue){
    if(currentValue >0){
        return "disabled"
    }else{
        return ""
    }
    
})


 Handlebars.registerHelper("TrangThai", function(currentValue){
     if(currentValue == '1'){
         return "Block"
     }
     else
     {
         return "Active"
     }
 })
 Handlebars.registerHelper("Thoihan", function(currentValue){
    if(currentValue <= 0){
        return "Hết hạn"
    }
    else
    {
        return currentValue
    }
})
 Handlebars.registerHelper("Mau", function(currentValue){
     if(currentValue =='1'){
         return "red"
     }else{
        return "green"
     }
     
 })
 Handlebars.registerHelper("Dong", function(currentValue){
    if(currentValue =='1'){
        return "alert-danger"
    }else{
       return "alert-success"
    }
 })
 Handlebars.registerHelper("LoaiTaiKhoan", function(currentValue){
    if(currentValue == '1'){
        return "Quản lí";
    } else{
        return "Nhân viên"
    }
})
Handlebars.registerHelper("DateFormat", function(currentValue){
    return  moment(currentValue).format("YYYY-MM-DD");
})

module.exports = router;
