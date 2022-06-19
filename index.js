const express = require('express');
const hbs = require('express-handlebars');

const { PORT } = require('./config/environment');
const routes = require('./routes');
const { dbInit } = require('./config/database');

const app = express();

app.engine('hbs', hbs.engine({
    extname: 'hbs'
}));

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(routes);

dbInit()
    .then(() => {
        app.listen(PORT, () => console.log(`Application is running on port ${PORT}...`));
    });
