const {Client} = require('pg'); //need to npm install pg

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'liam.kilkenny',
    password: 'password',
    port: 5432
})

client.connect(function(err){
    if(err) throw err
});

module.exports = client; //export so app.js can require this, database connection can be held in a different file