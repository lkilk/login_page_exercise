const client = require('./db');
const userLogin = require('./userLogin.js');

function processEditProfile(params, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        res.render('profile', {first_name: userLogin.myUser.getFirstName, surname: userLogin.myUser.getSurname, username: userLogin.myUser.getUsername, password: userLogin.myUser.getPassword, message: ""})
    }
}

function changePassword(params, res){
    let isLoggedIn = userLogin.checkLoggedIn();
    console.log(isLoggedIn);
    if (isLoggedIn != true){
        res.render('login', {message: 'Please Login'});
    }else{
        let username = userLogin.myUser.getUsername;
        let password = userLogin.myUser.getPassword;
        let newPassword = params.password;
        let columnName = 'username'
        let myUpdateQuery = `UPDATE public.my_first_table SET password='${newPassword}' WHERE ${columnName} = '${username}';`;
        console.log(newPassword + '//' + password)
        if(newPassword === password) {
            res.render('profile', {first_name: userLogin.myUser.getFirstName, surname: userLogin.myUser.getSurname, username: userLogin.myUser.getUsername, password: userLogin.myUser.getPassword, message: "Update Failed: Password used too recently"});
        }else{
            client.query(myUpdateQuery, 
                (error, result) => {
                    if(error){
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.render('profile', {first_name: userLogin.myUser.getFirstName, surname: userLogin.myUser.getSurname, username: userLogin.myUser.getUsername, password: userLogin.myUser.getPassword, message: "Password Succesfully Updated"});
        
                    }
                })
        }
    }
}

module.exports = {
    processEditProfile,
    changePassword
}