const express = require('express');
const fs = require('fs');
const app = express();

const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'qweqwe'
});
const users = JSON.parse(fs.readFileSync('users.json'));

app.use(session);
app.use(passport.initialize());
passport.use(new DigestStrategy({ qop: 'auth' }, (username, done) => {
    console.log(`\npassport.use: username = ${username}`);
    let rc = null;
    let credentials = getCredentials(username);
    if (!credentials) {
        rc = done(null, false);
        console.log(`denied: username = ${username}`);
    }
    else
        rc = done(null, credentials.username, credentials.password);
    return rc;
}, (params, done) => {
    console.log('params: ', params);
    done(null, true);
}));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res, next) => {
    if (req.session.logout) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
})
    .get(
        '/login',
        passport.authenticate('digest', { session: false }),
        (req, res) => { res.redirect('/resource'); }
    );

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    if (req.headers['authorization'])
        res.send('resourse');
    else
        res.redirect('/login');
});

app.get('*', (req, res) => {
    res.status(404).send('Error 404: Not Found');
});

const getCredentials = username => {
    console.log('username', username)
    console.log('found', users.find(u => u.username.toUpperCase() == username.toUpperCase()))
    return users.find(u => u.username.toUpperCase() == username.toUpperCase());
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});