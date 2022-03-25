const express = require('express'); //npm install express, npm install ejs
const { getEnvironmentData } = require('worker_threads');
const app = express(); 
const client = require('./db.js');
const http = require('http'); //npm install http
const bodyParser = require('body-parser'); //npm install body-parser
const path = require('path');
const user = require("./user.js");
let myUser = new user;
const registration = require('./registration.js');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', 'views'); // the path the the views (html templates) live in
app.set('view engine', 'ejs'); //ejs is the template(view engine) we are using

app.get('/', (req, res) => {
    res.render('index', {name: 'Liam'});
})
app.get('/testdb', (req, res) => {
    getData(req, res);
})
app.get('/login', (req, res) => {
    res.render('login', {message: ''});
})
app.post('/login', (req, res, next) => {
    verifyUsername(req.body, res);
})
app.get('/register', (req, res) => {
    res.render('register', {message: ''});
})
app.post('/register', (req, res, next) => {
    checkInput(req.body, res);  
})
app.get('/welcome', (req, res) => {
    let isLoggedIn = checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        res.render('welcome', { user: myUser.getFirstName + " " + myUser.getSurname });
    }
})
app.get('/profile', (req, res) => {
    processEditProfile(req, res);
})
app.post('/profile', (req, res, next) => {
    changePassword(req.body, res);
})
app.get('/logout', (req, res) => {
    processLogout(req, res);
})
app.get('/admin', (req, res) => {
    processAdmin(req, res);
})
app.post('/makeAdmin', (req, res) =>{
    processMakeAdmin(req.body, req, res);
})
app.post('/removeAdmin', (req, res) =>{
    processRemoveAdmin(req.body, req, res);
})
app.post('/deleteUser', (req, res) =>{
    processDeleteUser(req.body, req, res);
})

app.listen(3000, () => {
    console.log('Listenting on port 3000');
})

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
                        myUser.setUsername = result.rows[i].username
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
                    myUser.setPassword = dbpass;
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

function getData(req, res){
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
                res.render('testdb', {data});
            }
        })
}

function checkInput(params, res){
    let newUser = params.newuser;
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
                    if (result.rows[i].username === newUser){
                        res.render('register', { message: 'Username already exists'});
                        foundUser = true;
                        break;
                    }
                }
            if(!foundUser){
                registration.registerUser(params, res);

            }       
        }
    })   
}

function processEditProfile(params, res){
    let isLoggedIn = checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        res.render('profile', {first_name: myUser.getFirstName, surname: myUser.getSurname, username: myUser.getUsername, password: myUser.getPassword, message: ""})
    }
}

function changePassword(params, res){
    let isLoggedIn = checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let username = myUser.getUsername;
        let password = myUser.getPassword;
        let newPassword = params.password;
        let columnName = 'username'
        let myUpdateQuery = `UPDATE public.my_first_table SET password='${newPassword}' WHERE ${columnName} = '${username}';`;
        if(newPassword === password) {
            res.render('profile', {first_name: myUser.getFirstName, surname: myUser.getSurname, username: myUser.getUsername, password: myUser.getPassword, message: "Update Failed: Password used too recently"});
        }else{
            client.query(myUpdateQuery, 
                (error, result) => {
                    if(error){
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.render('profile', {first_name: myUser.getFirstName, surname: myUser.getSurname, username: myUser.getUsername, password: myUser.getPassword, message: "Password Succesfully Updated"});
        
                    }
                })
        }
    }
}

function processLogout(params, res){
    delete myUser;
    myUser.setFirstName = '';
    myUser.setSurname = '';
    myUser.setUsername = '';
    myUser.setPassword = '';
    myUser.setId = '';
    myUser.setIsAdmin ='';
    console.log('logging user out');
    console.log(myUser.getUsername)
    res.render('login', { message: ''})
}

function checkLoggedIn(){
    console.log('checking logged in')
    console.log(myUser.getUsername)
    if (myUser.getUsername == ''){
        return false
    }else{
        return true
    }
}

function processAdmin(req, res){
    let isLoggedIn = checkLoggedIn();
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
    let isLoggedIn = checkLoggedIn();
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
    let isLoggedIn = checkLoggedIn();
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
    let isLoggedIn = checkLoggedIn();
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