const client = require('./db');
const user = require("./user.js");
let myUser = new user;

function verifyUsername(params, res){
    let username = params.username;
    let foundUser = false;
    let tableName = 'my_first_table';
    let myQuery = `SELECT username FROM "${tableName}"`;
    client.query(myQuery, 
        (error, result) => {
            if(error){
                console.log(error);
                res.status(500).send(error);
            } else {
                for(let i = 0; i < result.rows.length; i++) {
                    if (result.rows[i].username === username){
                        foundUser = true;
                        verifyPassword(params, res);
                        break;
                    }
                }
            if(!foundUser){
                res.render('login', { message: 'Invalid username or password'});
            }       
        }
    })   
}


function verifyPassword(params, res){
    let username = params.username;
    let password = params.password;
    let columnName = 'username'
    let tableName = 'my_first_table';
    let myQuery = `SELECT * FROM "${tableName}" WHERE ${columnName} = '${username}'`;
    client.query(myQuery, 
        (error, result) => {
            if(error){
                console.log(error);
                res.status(500).send(error);
            } else {
                let dbpass = result.rows[0].password;
                if(dbpass === password) {
                    myUser.setUsername = result.rows[0].username
                    myUser.setPassword = result.rows[0].password;
                    myUser.setFirstName = result.rows[0].first_name;
                    myUser.setSurname = result.rows[0].surname;
                    myUser.setId = result.rows[0].id;
                    myUser.setIsAdmin = result.rows[0].isadmin;
                    console.table(myUser);
                    res.render('welcome', { user: myUser.getFirstName + " " + myUser.getSurname });
                }else{
                    res.render('login', { message: 'Invalid username or password'});
                }
            }
        })
}

function processLogout(params, res){
    delete myUser.first_name;
    delete myUser.surname;
    delete myUser.id;
    delete myUser.username;
    delete myUser.password;
    delete myUser.isadmin;
    // myUser.setFirstName = '';
    // myUser.setSurname = '';
    // myUser.setUsername = '';
    // myUser.setPassword = '';
    // myUser.setId = '';
    // myUser.setIsAdmin ='';
    console.log('logging user out');
    console.log(myUser.getUsername)
    res.render('login', { message: ''})
}

function checkLoggedIn(){
    console.log('checking logged in')
    console.log(myUser.getUsername)
    if (myUser.getUsername == undefined){
        return false
    }else{
        return true
    }
}

module.exports = {
    verifyUsername,
    verifyPassword,
    processLogout,
    checkLoggedIn,
    myUser
}