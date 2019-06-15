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
        from post p left join categories c on p.tagId = c.CatID
        limit ${limit} offset ${offset}
        `);
    },
    countByCat: () => {
        return db.load(`select count(*) as total from post`);
    },
    pageByCatWithID: (CatID, limit, offset) => {
        return db.load(`
        select *
        from post p left join categories c on p.tagId = c.CatID
        where p.tagId = ${CatID}
        limit ${limit} offset ${offset}
        `);
    },
    countByCatWithID: (CatID) => {
        return db.load(`select count(*) as total from post p where p.tagId = ${CatID}`);
    },
    single: id => {
        return db.load(`SELECT *
                        FROM post p left join categories c on p.tagId = c.CatID
                        WHERE p.PostID = ${id}`);
    },
    postCungChuyenMuc: (CatID, PostID) => {
        return db.load(`SELECT *
                        FROM post p left join categories c on p.tagID = c.CatID
                        WHERE p.catID = ${CatID} AND p.PostID <> ${PostID}
                        limit 5`);
    },
    commentByPostID: PostId => {
        return db.load(`SELECT *
                        FROM comments
                        WHERE PostID = ${PostId}`);
    },
    add: entity => {
        return db.add('post', entity)
    },
    update: entity => {
        return db.update('post', 'PostID', entity)
    },
    delete: id => {
        return db.delete('post', 'PostID', id)
    }
}