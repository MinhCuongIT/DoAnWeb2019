var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from users");
    },
    allSubscriber: () => {
        return db.load(`select id, username, name, DATE_FORMAT(date_register,'%d/%m/%Y')  as date_register ,(7- DATEDIFF(now(), date_register)) AS Date from users where type = 'Subscriber'`);
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
        return db.update('users', 'id', entity)
    },
    delete:username=>{
        return db.delete('users', 'username', username)
    },
    
}