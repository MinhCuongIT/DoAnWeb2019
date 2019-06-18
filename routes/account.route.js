var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var moment = require('moment')
var userModel = require('../models/user.model')
var passport = require('passport')
var auth = require('../middlewares/auth')
var bcrypt = require('bcrypt')

//Dev MODE
// router.get('/', (req, res, next) => {
//     userModel.all()
//         .then(rows => {
//             res.render('vwAccount/index', {
//                 accounts: rows
//             })
//         })
//         .catch(err => {
//             console.log(err)
//         })
// })

router.get('/register', (req, res, next) => {
    res.render('vwAccount/register')
})

router.post('/register', (req, res, next) => {
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
            type: req.body.rbLoai
        }
        userModel.add(entity).then(id => {
            res.redirect('/account/login')
        }).catch(err => {
            console.log(err)
            next()
        })
    } else {
        res.render('admin/vwAccounts/changeFail')
    }


})

// //for dev
// router.get('/delete/:username', (req, res, next) => {
//     var username = req.params.username
//     userModel.delete(username).then(n => {
//         res.redirect('/account')
//     }).catch(err => {
//         console.log(err)
//         next()
//     })
// })

router.get('/login', (req, res, next) => {
    res.render('vwAccount/login', {
        layout: false
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.render('vwAccount/login', {
                layout: false,
                err_message: info.message
            });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
})

router.get('/profile', auth, (req, res, next) => {
    // console.log(res.locals.authUser.dob)
    res.render('vwAccount/profile', {
        showEditButton: res.locals.authUser.type == 'Subscriber' ? true : false
    })
})

router.get('/profile/edit', auth, (req, res, next) => {
    if (res.locals.authUser.type !== 'Subscriber') {
        throw new Error('You do not have permission to access this link')
    }
    res.render('subscriber/edit')
})

router.post('/profile/edit', auth, (req, res, next) => {
    if (res.locals.authUser.type !== 'Subscriber') {
        throw new Error('You do not have permission to access this link')
    }
    var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD')
    userModel.updateGeneral(req.body.name, req.body.email, dob, res.locals.authUser.UserID)
        .then(id => {
            res.render('subscriber/editSuccess')
        })
        .catch(err => {
            console.log(err)
            next()
        })
})

router.get('/profile/changepassword', auth, (req, res, next) => {
    if (res.locals.authUser.type !== 'Subscriber') {
        throw new Error('You do not have permission to access this link')
    }
    res.render('subscriber/changePassword')
})

router.post('/profile/changepassword', auth, (req, res, next) => {
    if (res.locals.authUser.type !== 'Subscriber') {
        throw new Error('You do not have permission to access this link')
    }
    var ret = bcrypt.compareSync(req.body.oldPassword, res.locals.authUser.password)

    if (!ret) {
        res.render('subscriber/changeFailWithOld')
    } else {

        if (req.body.newPassword !== req.body.confirm) {
            res.render('subscriber/changeFail')
        } else {
            var saltRounds = 10
            var hash = bcrypt.hashSync(req.body.newPassword, saltRounds)
            userModel.updatePassword(res.locals.authUser.UserID, hash)
                .then(id => {
                    res.render('subscriber/changeSuccess')
                })
                .catch(err => {
                    console.log(err)
                    next()
                })
        }
    }


})

router.get('/dashboard', auth, (req, res, next) => {
    switch (res.locals.authUser.type) {
        case 'Admin':
            res.render('admin/index', {
                layout: 'main_ad.hbs'
            })
            break;
        case 'Writer':
            res.redirect('/writer')
            break;
        case 'Editor':
            res.redirect('/editor')
            break;
        case 'Subscriber':
            res.redirect('/subscriber')
            break;

        default:
            break;
    }
})


router.post('/logout', auth, (req, res, next) => {
    req.logOut()
    res.redirect('/account/login')
})

module.exports = router;