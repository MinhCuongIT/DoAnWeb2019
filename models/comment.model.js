var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from comments");
    },
    add: entity => {
        return db.add('comments', entity)
    },
    update: entity => {
        return db.update('comments', 'commentID', entity)
    },
    delete: id => {
        return db.delete('comments', 'commentID', id)
    }
}