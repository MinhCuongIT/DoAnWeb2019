var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from users");
    },
    single: username => {
        return db.load(`select * from users where username = ${username}`);
    },

    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    add: entity => {
        return db.add('users', entity);
    },
    update: entity => {
        return db.update('users', 'username', entity)
    },
    delete:username=>{
        return db.delete('users', 'username', username)
    }
}