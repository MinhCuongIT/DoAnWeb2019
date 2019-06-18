var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from tags");
    },
   
    single: id => {
        return db.load(`select * from tags where id = ${id}`);
    },
   
    add: entity => {
        return db.add('tags', entity)
    },
    update: entity => {
        return db.update('tags', 'id', entity)
    },
    delete: id => {
        return db.delete('tags', 'id', id)
    }
}