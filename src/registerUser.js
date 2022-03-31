const client = require('./db');

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
            res.render('login', { message: 'Account successfully created'});
        }
    })
}   

module.exports = {
    checkInput,
    registerUser
}