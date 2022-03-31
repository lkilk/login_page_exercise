const express = require('express'); //npm install express, npm install ejs
//const { getEnvironmentData } = require('worker_threads');
const app = express(); 
const http = require('http'); //npm install http
const bodyParser = require('body-parser'); //npm install body-parser
//const path = require('path');

const registration = require('./registerUser.js');
const admin = require('./userAdmin.js');
const userLogin = require('./userLogin.js');
const profile = require('./editProfile.js');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.set('views', 'views'); // the path the the views (html templates) live in
app.set('view engine', 'ejs'); //ejs is the template(view engine) we are using

app.get('/', (req, res) => {
    res.render('index', {name: 'Liam'});
})

// app.get('/testdb', (req, res) => {
//     getData(req, res);
// })

app.get('/login', (req, res) => {
    res.render('login', {message: ''});
})

app.post('/login', (req, res, next) => {
    userLogin.verifyUsername(req.body, res);
})

app.get('/register', (req, res) => {
    res.render('register', {message: ''});
})

app.post('/register', (req, res, next) => {
    registration.checkInput(req.body, res);  
})

app.get('/welcome', (req, res) => {
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        res.render('welcome', { user: userLogin.myUser.getFirstName + " " + userLogin.myUser.getSurname });
    }
})

app.get('/profile', (req, res) => {
    profile.processEditProfile(req, res);
})

app.post('/profile', (req, res, next) => {
    profile.changePassword(req.body, res);
})

app.get('/logout', (req, res) => {
    userLogin.processLogout(req, res);
})

app.get('/admin', (req, res) => {
    admin.processAdmin(req, res);
})

app.post('/makeAdmin', (req, res) =>{
    admin.processMakeAdmin(req.body, req, res);
})

app.post('/removeAdmin', (req, res) =>{
    admin.processRemoveAdmin(req.body, req, res);
})

app.post('/deleteUser', (req, res) =>{
    admin.processDeleteUser(req.body, req, res);
})

app.listen(3000, () => {
    console.log('Listenting on port 3000');
})

// function getData(req, res){
//     let tableName = 'my_first_table';
//     let myQuery = `SELECT * FROM ${tableName}`
//     client.query(myQuery, 
//         (error, result) => {
//             if(error){
//                 console.log(error);
//                 res.status(500).send(error);
//             } else {
//                 let data = result.rows;
//                 console.table(data);
//                 res.render('testdb', {data});
//             }
//         })
// }