require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// basic authentication
app.use((req, res, next) => {

    // -----------------------------------------------------------------------
    // authentication middleware
    if (!req.originalUrl.startsWith('/api')) return next();

    const auth = {
        login: process.env.REST_USER,
        password: process.env.REST_PASSWORD
    } // change this

    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="dreamole2020"') // change this
    res.status(401).send('Authentication required.') // custom message

    // -----------------------------------------------------------------------
});

var routes = require('./api/routes/apiRoutes'); //importing route
routes(app);

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));