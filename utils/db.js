var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'matkhau@123',
        database: 'dack',
        port: '3306',
    });
}
module.exports = {
    load: sql => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(results)
                }
                connection.end()
            })
        })
    },
    add: (tableName, entity)=>{
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `insert into ${tableName} set ?`
            connection.query(sql, entity ,(error, value) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(value.insertId)
                }
                connection.end()
            })
        })
    },
    update: (tableName, idField, entity) => {
        return new Promise((resolve, reject) => {
            var id = entity[idField];
            delete entity[idField];
            var connection = createConnection();
            connection.connect();
            var sql = `update ${tableName} set ? where ${idField} = ?`
            connection.query(sql, [entity, id], (error, value) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(value.changedRows)
                }
                connection.end()
            })
        })
    },
    delete: (tableName, idField, id) => {
        return new Promise((resolve, reject) => {
            var connection = createConnection();
            connection.connect();
            var sql = `delete from ${tableName} where ${idField} = ?`
            connection.query(sql, id, (error, value) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(value.affectedRows)
                }
                connection.end()
            })
        })
    }
}


