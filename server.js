const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const exphbs  = require('express-handlebars');
const Sequelize = require('sequelize');

let id = 1;

var sequelize = new Sequelize('rccojdqf', 'rccojdqf', 'BjomlmgHj26bSoFO2WKTsOcutb7FMpQA', {
    host: 'mahmud.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

const Student = sequelize.define('Student', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    created_at: Sequelize.DATE
});

// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return date.toLocaleDateString();
        }
    },
    extname:".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/update-user', (req, res) => {
    sequelize.sync().then(function () {
    const id = req.query.id;
    Student.findAll({ 
        where: {
            id: id
        }
    }).then(function(data){        
        res.render('edit', { users: data, layout:false });
    }).catch((error) => {
        console.error(error);
        res.status(500).send('Internal server error');
        return;
    });
});
});

// Update user data in database
app.post('/update-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to update users in PostgreSQL.
    Receving three parameters id, name and email

    Using the query:
    "UPDATE users SET name = $1, email = $2 WHERE id = $3"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Updating data into PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/

    const name = req.body.name;
    const id = req.body.id;
    const email = req.body.email;

    sequelize.sync().then(function () {
        Student.update({
            id: id,
            name: name,
            email: email,
            created_at: Date.now()
        }, {
            where: { id: id }
        }).then(() => {
            res.redirect("/");
        })
        .catch((error) => {
            console.log(error); res.status(500).json({ message: 'Error update data into PostgreSQL' });
        });
    });
  });

// Delete user data in database
app.get('/delete-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to delete users in PostgreSQL.
    Receving on paramter id

    Using the query:
    "DELETE FROM users WHERE id = $1"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Delete data from PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/

    const id = req.query.id;

    sequelize.sync().then(function () {
        Student.destroy({
            where: { id: id }
        }).then(() => { 
            res.redirect("/");
        })
        .catch((err) => {
            console.log(error); res.status(500).json({ message: 'Error Delete data from PostgreSQL' });
        });
    });
  });

// Handle form submission
app.post('/insert-user', (req, res) => {
    const { name, email } = req.body;
    sequelize.sync().then(() => {
        console.log(name);
        console.log(email);
        Student.create({
            id: id,
            name: name,
            email: email,
            created_at: Date.now()
        }).then((user) => {
            res.redirect("/");
        })
        .catch((error) => {
            console.log(error); res.status(500).json({ message: 'Error inserting data into PostgreSQL' });
        });
        });
    });


app.get('/', (req, res) => {
        sequelize.sync().then(function () {
            Student.findAll({ 
                order: [
                    ['id', 'ASC']
                ],
            }).then(function(data){        
                res.render('index', { users: data, layout:false });
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Internal server error');
                return;
            });
    });
});


// Start the server
sequelize
    .authenticate()
    .then(function() {
        app.listen(5000, () => {
            console.log('Server started on http://localhost:5000');
        });
    })
