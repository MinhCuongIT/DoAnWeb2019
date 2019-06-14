var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var moment = require('moment')
var userModel = require('../models/user.model')
var passport = require('passport')
var auth = require('../middlewares/auth')

router.get('/', (req, res, next) => {
    userModel.all()
        .then(rows => {
            res.render('vwAccount/index', {
                accounts: rows
            })
        })
        .catch(err => {
            console.log(err)
        })
})

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
        res.end("Mat khau khong khop!")
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
    res.render('vwAccount/profile',)
})
router.get('/dashboard', auth, (req, res, next) => {
    switch (res.locals.authUser.type) {
        case 'Admin':
            res.render('admin/index')
            break;
        case 'Writer':
            res.render('writer/index')
            break;
        case 'Editor':
            res.render('editor/index')
            break;
        case 'Subscriber':
            res.render('subscriber/index')
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