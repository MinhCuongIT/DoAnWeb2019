var exphbs = require('express-handlebars');
var hbs_section = require('express-handlebars-sections');
var numeral = require('numeral');
var moment = require('moment')

module.exports = function (app) {
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        layoutsDir: 'views/_layouts',
        helpers: {
            format: val => {
                return numeral(val).format('0,0') + '₫';
            },
            mySubString: str => {
                return str.substr(0, 125) + "...";
            },
            myDatetime: date =>{
                return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            },
            section: hbs_section(),
        }
    }))

    app.set('view engine', 'hbs')

}