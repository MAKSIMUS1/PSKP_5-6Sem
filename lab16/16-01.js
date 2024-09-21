const express = require('express');
const fs = require('fs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'qweqwe'
});

const app = express();
const users = JSON.parse(fs.readFileSync('users.json'));

app.use(session);
app.use(passport.initialize());
passport.use(new BasicStrategy((username, password, done) => {
    console.log(`\npassport.use: username = ${username}, password = ${password}`);
    let rc = null;
    let credentials = getCredentials(username);
    if (!credentials) {
        rc = done(null, false, { message: 'Incorrect username' });
        console.log(`denied: username = ${username}, password = ${password}`);
    }
    else if (!verifyPassword(credentials.password, password)) {
        rc = done(null, false, { message: 'Incorrect password' });
        console.log(`incorrect: username = ${username}, password = ${password}`);
    }
    else
        rc = done(null, username);
    return rc;
}));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', 
  (req, res, next) => {
    if (req.session.logout) {
      req.session.logout = false;
      delete req.headers['authorization'];
    }
    next();
  },
  passport.authenticate('basic', { session: false }),
  (req, res) => {
    res.redirect('/resource');
  }
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
const verifyPassword = (firstPassword, secondPassword) => firstPassword == secondPassword;

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});