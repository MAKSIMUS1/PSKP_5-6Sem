import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { v4 as uuidv4 } from 'uuid';
import { Strategy } from 'passport-local'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    genid: req => {
        return uuidv4();
    },
    secret: 'my_secret_session',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => { done(null, user); });
passport.deserializeUser((user, done) => { done(null, user); });

passport.use(new Strategy((username, password, done) => {
    const users = JSON.parse(readFileSync(join(__dirname, './users.json')));
    const index = users.findIndex(e => e.username === username);
    const user = users[index];

    if (index === -1)
        return done(null, false, { 'Error': 'Incorrect credentials' });

    if (user.password !== password)
        return done(null, false, { 'Error': `Passwords doesn't match` });

    return done(null, user);
}));




app.get('/', (req, res) => { res.redirect('/login'); });

app.get('/login', (req, res) => { res.sendFile(join(__dirname, './static/login.html')); });

app.post('/login', passport.authenticate(
    'local',
    {
        successRedirect: '/resource',
        failureRedirect: '/login'
    }
));


app.get('/resource', (req, res) => {
    if (!req.user)
        return res.status(401).send('<h2>[ERROR] 401: Unauthorized</h2>');
    return res.send(`<h2>Welcome to the resource, ${req.user.username}!</h2>`);

});


app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err)
            console.log(err);

        res.redirect('/login');
    })
});


app.listen(process.env.PORT || PORT, () => console.log(`[OK] Server running at localhost:${PORT}/\n`));