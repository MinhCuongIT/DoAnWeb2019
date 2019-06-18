var db = require('../utils/db');


module.exports = {
    all: () => {
        return db.load("select * from users");
    },
    allEditor: () => {
        return db.load("select * from users where type = 'Editor'");
    },
    allSubscriber: () => {
        return db.load(`select UserID, username, name, DATE_FORMAT(date_update,'%d/%m/%Y')  as date_update ,(7-DATEDIFF( now(),date_update)) AS Date from users where type = 'Subscriber'`);
    },
    renewal: (userId, date) => {
        return db.load(`update users set date_update = '${date}' where UserID = ${userId}`);
    },
    updateGeneral: (name, email, dob, userId) => {
        return db.load(`update users set name = '${name}', email = '${email}', dob = '${dob}' where UserID = ${userId}`);
    },
    updatePassword: (userId, newPassword) => {
        return db.load(`update users set password = '${newPassword}' where UserID = ${userId}`);
    },
    single: username => {
        return db.load(`select * from users where username = '${username}'`);
    },
    singleByUserID: userId => {
        return db.load(`select * from users where UserID = ${userId}`);
    },
    setRole: (userId, catId) => {
        return db.load(`update users set CatID = ${catId} where UserID = ${userId}`);
    },
    singleByUserName: userName => {
        return db.load(`select * from users where username = '${userName}'`);
    },

    add: entity => {
        return db.add('users', entity);
    },
    update: entity => {
        return db.update('users', 'UserID', entity)
    },
    
    delete: username => {
        return db.delete('users', 'username', username)
    }
}