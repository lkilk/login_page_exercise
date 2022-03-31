class MyUser {
    constructor(first_name, surname, id, username, password,  isadmin){
        this.first_name = first_name;
        this.surname = surname;
        this.id = id;
        this.password = password;
        this.username = username;
        this.isadmin = isadmin;
    }

    get getFirstName() {
        return this.first_name;
    }
    get getSurname() {
        return this.surname;
    }
    get getId() {
        return this.id;
    }
    get getUsername() {
        return this.username;
    }
    get getPassword() {
        return this.password;
    }
    get getIsAdmin() {
        return this.isadmin;
    }

    set setFirstName(first_name) {
        this.first_name = first_name;
    }
    set setSurname(surname) {
        this.surname = surname;
    }
    set setId(id) {
        this.id = id;
    }
    set setUsername(username) {
        this.username = username;
    }
    set setPassword(password) {
        this.password = password;
    }
    set setIsAdmin(isadmin) {
        this.isadmin = isadmin;
    }

}

module.exports = MyUser;