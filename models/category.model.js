var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from categories");
    },
    allParent: () => {
        return db.load("select * from categories where CatFather = 0");
    },
    single: id => {
        return db.load(`select * from post where CatID = ${id}`);
    },
    topNewest: () => {
        return db.load(`
            SELECT  DISTINCT *
            FROM    post p left join categories c on p.tagId = c.CatID
            ORDER BY p.date desc
            LIMIT 10
        `);
    },
    topVewest: () => {
        return db.load(`
            SELECT  DISTINCT *
            FROM    post p left join categories c on p.tagId = c.CatID
            ORDER BY p.views desc
            LIMIT 10
        `);
    },
    mainCarousel: id => {
        return db.load(`
            SELECT  DISTINCT *
            FROM    post
            WHERE catId = ${id}
            Order by date desc
            LIMIT 3
        `);
    },
    tinHotTrongNgay: () => {
        return db.load(`
            SELECT  DISTINCT *
            FROM    post p left join categories c on p.tagId = c.CatID
            ORDER BY p.date desc, p.views desc
            LIMIT 6
        `);
    },
    add: entity => {
        return db.add('Categories', entity)
    },
    update: entity => {
        return db.update('Categories', 'CatID', entity)
    },
    delete: id => {
        return db.delete('Categories', 'CatID', id)
    }
}