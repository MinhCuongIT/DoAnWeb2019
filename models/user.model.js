var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from users");
    },
    allSubscriber: () => {
        return db.load(`select UserID, username, name, DATE_FORMAT(date_register,'%d/%m/%Y')  as date_register ,(7- DATEDIFF(now(), date_register)) AS Date from users where type = 'Subscriber'`);
    },
    allEditor: () => {
        return db.load(`select * from users where type ='Editor'`);
    },

    single: id => {
        return db.load(`select * from users where UserID = ${id}`);
    },
    

    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    GianHan: entity => {
        return db.GiaHan('users', entity);
    },
    update: entity => {
        return db.update('users', 'UserID', entity)
    },
    delete:username=>{
        return db.delete('users', 'username', username)
    },
    
}