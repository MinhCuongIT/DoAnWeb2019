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
        limit 9 offset 9
        `);
    },
    countByCat: () => {
        return db.load(`select count(*) as total from post`);
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