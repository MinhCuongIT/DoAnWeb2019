var categoryModel = require('../models/category.model')
module.exports = (req, res, next) => {
    categoryModel.all()
        .then(rows => {
            var menu = [];
            if (rows.length > 0) {
                menu = rows.filter(x => x.CatFather == 0);
                for (const item of menu) {
                    var childrenMenu = rows.filter(x => x.CatFather == item.id);
                    item['childs'] = childrenMenu;
                }
            }
            res.locals.lcCategories = menu;
            console.log('====================================');
            console.log(menu);
            console.log('====================================');
            next()
        })
        .catch(err => {
            console.log(err)
        })
}