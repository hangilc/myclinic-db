
function exec(conn, sql, args){
    if( args == null ) args = [];
    return new Promise(function(resolve, reject){
        conn.query(sql, args, function(err, result){
            if( err ){
                reject(err);
                return;
            }
            resolve(result);
        })
    })
}
exports.exec = exec;

function insert(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        return result.insertId;
    });
}
exports.insert = insert;

function get(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        if( result.length === 1 ){
            return result[0];
        }
        if( result.length === 0 ){
            throw new Error("cannot find row");
        } else {
            throw new Error("multiple rows found to get");
        }
    });
}
exports.get = get;

function find(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        if( result.length === 1 ){
            return result[0];
        } else if( result.length === 0 ){
            return null;
        } else {
            throw new Error("multiple rows found to find");
        }
    })
}
exports.find = find;

exports.query = exec;

function update(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        if( result.affectedRows === 1 ){
            return true;
        } else {
            throw new Error("update failed");
        }
    })
}
exports.update = update;

function doDelete(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        if( result.affectedRows === 1 ){
            return true;
        } else {
            throw new Error("delete failed");
        }
    })
}
exports.delete = doDelete;

function getValue(conn, sql, args){
    return exec(conn, sql, args)
    .then(function(result){
        if( result.length === 1 ){
            var row = result[0];
            for(var key in row){
                return row[key];
            }
        } else {
            throw new Error("getValue failed");
        }
    })
}
exports.getValue = getValue;