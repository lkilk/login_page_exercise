const client = require('./db');
const user = require("./user.js");


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

module.exports = {
    registerUser
}