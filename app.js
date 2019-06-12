var express = require('express');
var app = express();
var morgan = require('morgan');
var port = 3000;

var categoryModel = require('./models/category.model')

app.use(express.static('public'));
require('./middlewares/session')(app)
require('./middlewares/passport')(app)
app.use(require('./middlewares/auth-local.mdw'))
app.use(require('./middlewares/locals.mdw'))

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'))

require('./middlewares/view-engine')(app)

app.get('/', (req, res) => {
    Promise.all([
        categoryModel.mainCarousel(1),
        categoryModel.mainCarousel(2),
        categoryModel.mainCarousel(3),
        categoryModel.mainCarousel(4),
        categoryModel.mainCarousel(5),
        categoryModel.mainCarousel(6),
        categoryModel.tinHotTrongNgay()
    ])
        .then(([m1, m2, m3, m4, m5, m6, tinhots]) => {
            m1[0].active = true
            m2[0].active = true
            m3[0].active = true
            m4[0].active = true
            m5[0].active = true
            m6[0].active = true
            res.render('home', {
                m1,
                m2,
                m3,
                m4,
                m5,
                m6,
                tinhots
            })
        })
        .catch(err => {
            console.log(err)
            next()
        })


})

app.use('/account', require('./routes/account.route'))
// app.use('/categories', require('./routes/category.route'))
// app.use('/admin/categories', require('./routes/admin/category.route'))

app.use((req, res, next) => {
    res.render('404', {
        layout: false
    })
})

app.use((error, req, res, next) => {
    res.render('error', {
        layout: false,
        msg: error.message,
        error
    })
})

app.listen(port, () => {
    console.log('Web server is running at http://localhost:3000')
})