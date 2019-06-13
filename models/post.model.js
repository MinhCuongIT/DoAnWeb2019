var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from post");
    },
    allByCat: catId => {
        return db.load(`select * from post where catId = ${catId}`);
    },
    pageByCat: (limit, offset) => {
        return db.load(`
        select *
        from post p left join categories c on p.catId = c.id
        limit ${limit} offset ${offset}
        `);
    },
    countByCat: () => {
        return db.load(`select count(*) as total from post`);
    },
    pageByCatWithID: (CatID, limit, offset) => {
        return db.load(`
        select *
        from post p left join categories c on p.tagId = c.id
        where p.tagId = ${CatID}
        limit ${limit} offset ${offset}
        `);
    },
    countByCatWithID: (CatID) => {
        return db.load(`select count(*) as total from post p where p.tagId = ${CatID}`);
    },
    single: id => {
        return db.load(`select * from post where id = ${id}`);
    },
    add: entity => {
        return db.add('post', entity)
    },
    update: entity => {
        return db.update('post', 'id', entity)
    },
    delete: id => {
        return db.delete('Products', 'id', id)
    }
}