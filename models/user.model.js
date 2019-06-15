var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from users");
    },
    allSubscriber: () => {
        return db.load("select * from users where type = 'Subscriber'");
    },
    single: username => {
        return db.load(`select * from users where username = ${username}`);
    },

    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    GianHan: entity => {
        return db.GiaHan('users', entity);
    },
    update: entity => {
        return db.update('users', 'username', entity)
    },
    delete:username=>{
        return db.delete('users', 'username', username)
    }
}