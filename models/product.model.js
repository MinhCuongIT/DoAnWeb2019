var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from Products");
    },
    allByCat: catId => {
        return db.load(`select * from Products where CatID = ${catId}`);
    },
    pageByCat: (catId, limit, offset) => {
        return db.load(`select * from Products where CatID = ${catId} limit ${limit} offset ${offset}`);
    },
    countByCat: catId => {
        return db.load(`select count(*) as total from Products where CatID = ${catId}`);
    },
    single: id => {
        return db.load(`select * from Products where ProID = ${id}`);
    },
    add: entity => {
        return db.add('Products', entity)
    },
    update: entity => {
        return db.update('Products', 'ProID', entity)
    },
    delete: id => {
        return db.delete('Products', 'ProID', id)
    }
}