var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from categories");
    },
    allParent: () => {
        return db.load("select * from categories where CatFather = 0");
    },
    allWithDetails: () => {
        
    },
    single: id => {
        return db.load(`select * from categories where CatID = ${id}`);
    },
    add: entity => {
        return db.add('Categories', entity)
    },
    update: entity => {
        return db.update('Categories','CatID', entity)
    },
    delete: id => {
        return db.delete('Categories', 'CatID', id)
    }
}