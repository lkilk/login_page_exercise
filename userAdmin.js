const client = require('./db');
const userLogin = require('./userLogin.js');

function processAdmin(req, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let tableName = 'my_first_table';
        let myQuery = `SELECT * FROM ${tableName}`
        client.query(myQuery, 
            (error, result) => {
                if(error){
                    console.log(error);
                    res.status(500).send(error);
                } else {
                    let data = result.rows;
                    console.table(data);
                    res.render('admin', {data});
                }
            })
    }
}

function processMakeAdmin(params, req, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let uid = params.hiddenAdminId;
        let tableName = 'my_first_table';
        let myQuery = `UPDATE ${tableName} SET isadmin = 'Y' WHERE id = ${uid}`;
        client.query(myQuery, 
            (error, result) => {
                if(error){
                    console.log(error);
                    res.status(500).send(error);
                } else {
                
                    processAdmin(req, res);
                }
            })
    }
}

function processRemoveAdmin(params, req, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let uid = params.hiddenRemoveAdminId;
        let tableName = 'my_first_table';
        let myQuery = `UPDATE ${tableName} SET isadmin = 'N' WHERE id = ${uid}`;
        client.query(myQuery, 
            (error, result) => {
                if(error){
                    console.log(error);
                    res.status(500).send(error);
                } else {
                
                    processAdmin(req, res);
                }
            })
    }
}

function processDeleteUser(params, req, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let uid = params.hiddenId;
        let tableName = 'my_first_table';
        let myQuery = `DELETE FROM ${tableName} WHERE id = ${uid}`;
        client.query(myQuery, 
            (error, result) => {
                if(error){
                    console.log(error);
                    res.status(500).send(error);
                } else {
                
                    processAdmin(req, res);
                }
            })
    }
}

module.exports = {
    processAdmin,
    processMakeAdmin,
    processRemoveAdmin,
    processDeleteUser
}