var express = require('express');
var router = express.Router();
var postModel = require('../../models/post.model')
var userModel = require('../../models/user.model')
var auth = require('../../middlewares/auth')
var moment = require('moment')
var Handlebars = require('handlebars')
var categoryModel = require('../../models/category.model')
var bcrypt = require('bcrypt')
var tagsModel=require('../../models/tag.model')
// ============ Màn hình chủ ============ //
// router.get('/', auth, (req, res) => {
//     res.end('Man hinh chu cua admin')
// })

// ============ Quản lý danh mục ============ //

router.get('/categories/', auth, (req, res) => {

    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }

    categoryModel.all().then(rows => {
        res.render('admin/vwCategories/index', {
            categories: rows,
            layout: 'main_ad.hbs'
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
           layout: 'main_ad.hbs'
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
            layout: 'main_ad.hbs'
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
                        layout: 'main_ad.hbs'
                    })
                }
                else {
                    res.render('admin/vwCategories/edit', {
                        error: true,
                        layout: 'main_ad.hbs'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.end("Co loi xay ra!")
            })
    }

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
router.get('/tags/', auth, (req, res) => {

    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }

    tagsModel.all().then(rows => {
        res.render('admin/vwTags/index', {
            tags: rows,
            layout: 'main_ad.hbs'
        })
    }).catch(err => {
        console.log(err)
    })
})
router.get('/tags/add', (req, res) => { 
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    tagsModel.all().then(rows => {
       // res.json(rows)
       res.render('admin/vwTags/add', {
        tags: rows,
        layout: 'main_ad.hbs'
       })
   }).catch(err => {
       console.log(err)
   })

   
})
router.get('/tags/edit/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    var id = req.params.id
    if (isNaN(id)) {
        res.render('admin/vwTags/edit', {
            error: true,
            layout: 'main_ad.hbs'
        })
    }
    else {
        console.log(id)
        tagsModel.single(id)
            .then(rows => {
                console.log(rows[0])
                if (rows.length > 0) {
                    res.render('admin/vwTags/edit', {
                        error: false,
                        tags: rows[0],
                        layout: 'main_ad.hbs'
                    })
                }
                else {
                    res.render('admin/vwTags/edit', {
                        error: true,
                        layout: 'main_ad.hbs'
                    })
                }
            })
            .catch(err => {
                console.log(err)
                res.end("Co loi xay ra!")
            })
    }

})



router.post('/tags/add', (req, res) => {
    // console.log(req.body)
    // res.end('...')
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    tagsModel.add({
        name:req.body.name,

       
        
    })
        .then(id => {
            console.log(`insertId: ${id}`)
            res.redirect('/admin/tags')
        })
        .catch(err => {
            console.log(err)
        })
})



router.post('/tags/update', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    tagsModel.update(req.body)
        .then(n => {
            res.redirect('/admin/tags')
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/tags/delete', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    tagsModel.delete(req.body.id)
        .then(n => {
            res.redirect('/admin/tags')
        })
        .catch(err => {
            console.log(err)
        })
})


// ============ Quản lý xuất bản bài post ============ //
router.get('/post', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    postModel.allToPublish()
        .then(rows => {
            res.render('admin/vwPosts/index', {
                layout: 'main_ad.hbs',
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
router.get('/accounts', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    userModel.all()
        .then(rows => {
            res.render('admin/vwAccounts/viewAccount', {
                layout: 'main_ad.hbs',
                users: rows
            })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/accounts/edit/:user', auth, (req, res) => {
    var userId = req.params.user
    userModel.singleByUserID(userId)
        .then(rows => {
            res.render('admin/vwAccounts/editAccount', {
                layout: 'main_ad.hbs',
                user: rows[0]
            })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/accounts/edit/:user', auth, (req, res) => {
    var userId = req.params.user
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD')
    userModel.updateGeneral(req.body.name, req.body.email, dob, userId)
        .then(id => {
            res.redirect('/admin/accounts')
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

router.get('/accounts/changepassword/:user', auth, (req, res) => {
    var userId = req.params.user
    console.log(`Doi mat khau cho ${userId}`)
    res.render('subscriber/changePassword', {
        layout: 'main_ad.hbs'
    })
})

router.post('/accounts/changepassword/:user', auth, (req, res) => {
    var userId = req.params.user
    console.log(`Doi mat khau cho ${userId}`)
    userModel.singleByUserID(userId)
        .then(rows => {
            var ret = bcrypt.compareSync(req.body.oldPassword, rows[0].password)

            if (!ret) {
                res.render('admin/vwAccounts/changeFailWithOld')
            } else {

                if (req.body.newPassword !== req.body.confirm) {
                    res.render('admin/vwAccounts/changeFail')
                } else {
                    var saltRounds = 10
                    var hash = bcrypt.hashSync(req.body.newPassword, saltRounds)
                    userModel.updatePassword(userId, hash)
                        .then(id => {
                            res.redirect('/admin/accounts')
                        })
                        .catch(err => {
                            console.log(err)
                            next()
                        })
                }
            }
        })
        .catch(err => {
            console.log(err)
        })

})

router.get('/accounts/addadmin', auth, (req, res) => {
    res.render('admin/vwAccounts/addAccountAdmin', {
        layout: 'main_ad.hbs'
    })
})

router.post('/accounts/addadmin', auth, (req, res) => {
    var saltRounds = 10
    var hash = bcrypt.hashSync(req.body.password, saltRounds)
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD')
    if (req.body.password === req.body.confirm) {
        var entity = {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            name: req.body.name,
            dob: dob,
            type: 'Admin',
            date_register:moment().format('YYYY-MM-DD'),
            date_update:moment().format('YYYY-MM-DD') 
        }
        userModel.add(entity).then(id => {
            res.redirect('/admin/accounts')
        }).catch(err => {
            console.log(err)
            next()
        })
    } else {
        res.render('admin/vwAccounts/changeFail')
    }

})
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
                        layout: 'main_ad.hbs',
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
            layout: 'main_ad.hbs'
        })
    }
    else {
        userModel.setRole(req.body.selectUser, req.body.selectCat)
            .then(id => {
                res.render('admin/vwAccounts/success', {
                    layout: 'main_ad.hbs'
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
})
// ============ Quản lý Gia Han ============ //
router.get('/accounts/giaHan', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    userModel.allSubscriber().then(rows => {
      
       // res.json(rows)
       res.render('admin/vwAccounts/giaHan', {
        user: rows,
        layout: 'main_ad.hbs'
       })
   }).catch(err => {
       console.log(err)
   })
})

router.get('/accounts/giaHan/:id', auth, (req, res) => {
    if (res.locals.authUser.type !== 'Admin') {
        throw new Error('You do not have permission to access this link')
    }
    console.log(moment().format('YYYY-MM-DD'))
    var entity={
        UserID:req.params.id,
        date_update:moment().format('YYYY-MM-DD')
    }
   
    userModel.update(entity)
  
        .then(n => {
            console.log(entity)
            res.redirect('/admin/accounts/giaHan')
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