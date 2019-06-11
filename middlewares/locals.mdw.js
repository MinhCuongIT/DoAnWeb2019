var categoryModel = require('../models/category.model')
module.exports = (req, res, next) => {
    Promise.all([
        categoryModel.all(),
        categoryModel.topNewest(),
        categoryModel.topVewest(),
    ])
        .then(([rows1, rows2, rows3]) => {
            var menu = [];
            if (rows1.length > 0) {
                menu = rows1.filter(x => x.CatFather == 0);
                for (const item of menu) {
                    var childrenMenu = rows1.filter(x => x.CatFather == item.id);
                    item['childs'] = childrenMenu;
                }
            }
            res.locals.lcCategories = menu;
            res.locals.lcTop10New = rows2;
            res.locals.lcTop10Vew = rows3;
            next();
        })
        .catch(err => {
            console.log(err)
        })
}