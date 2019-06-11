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
    res.render('home')


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