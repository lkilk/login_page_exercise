const express = require('express'); //npm install express, npm install ejs
const { getEnvironmentData } = require('worker_threads');
const app = express(); 
const client = require('./db.js');
const http = require('http'); //npm install http
const bodyParser = require('body-parser'); //npm install body-parser
const path = require('path');
const user = require("./user.js");
let myUser = new user;


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
    res.render('welcome', {user: ''});
})
app.get('/profile', (req, res) => {
    processEditProfile(req, res);
})
app.get('/logout', (req, res) => {
    processLogout(req, res);
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
                registerUser(params, res);

            }       
        }
    })   
}

function registerUser(params, res){
    let firstName = params.fname;
    let surname = params.sname;
    let newUser = params.newuser;
    let newPass = params.newpass;
    let column1 = 'first_name'
    let column2 = 'surname'
    let column3 = 'username'
    let column4 = 'password'
    let tableName = 'my_first_table';
    let myInsertQuery = `INSERT INTO public.${tableName} (${column1}, ${column2}, ${column3}, ${column4}) VALUES ('${firstName}', '${surname}', '${newUser}', '${newPass}');`;
    client.query(myInsertQuery, (error, result) => {
        if(error){
            console.log(error);
            res.status(500).send(error);
        } else {
            res.render('login');
            res.render('login', { message: 'Account successfully created'});
        }
    })
}    

function processEditProfile(params, res){
    res.render('profile', {first_name: myUser.getFirstName, surname: myUser.getSurname, username: myUser.getUsername, password: myUser.getPassword, message: ""})
    
}

function processLogout(params, res){
    myUser.getFirstName = '';
    myUser.getSurname = '';
    myUser.getUsername = '';
    myUser.getPassword = '';
    myUser.getId = '';
    myUser.getIsAdmin ='';
    res.render('login', { message: ''})
}