const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: '18864baec6c8d02c8059',
  clientSecret: '290b64fe580f42c59350fb05ce0c3551adadc60d',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/github',
  passport.authenticate('github', { session: false }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/resource');
  }
);

app.get('/resource', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`RESOURCE: User ID: ${req.user.id}, Username: ${req.user.username}`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});


app.get('/login', (req, res) => {
  res.send('Please login with GitHub <a href="/auth/github">here</a>');
});

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
