var exphbs = require('express-handlebars');
var hbs_section = require('express-handlebars-sections');
var numeral = require('numeral');


module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            format: val => {
                return numeral(val).format('0,0') + '₫';
            },
            section: hbs_section(),
        }
    }))

    app.set('view engine', 'hbs')

}