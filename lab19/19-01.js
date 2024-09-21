const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const redis = require('redis');
const redisClient = redis.createClient();
const app = express();
const { Ability, AbilityBuilder } = require('casl');

redisClient.connect();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('lab_19', 'student', 'fitfit',
    { host: 'localhost', dialect: 'mssql' }
);
const {users, repos, commits} = require('./Models').ORM(sequelize);

const accessKey = 'access_key';
const refreshKey = 'refresh_key';

app.use(express.static(__dirname + '/public'));
app.use(cookieParser('cookie_key'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const { rules, can } = AbilityBuilder.extract();
    console.log('accessToken:', req.cookies.accessToken);

    if (req.cookies.accessToken) {
        jwt.verify(req.cookies.accessToken, accessKey, (err, payload) => {
            if (err) {
                console.log('err', err);
                next();
            } else if (payload) {
                req.payload = payload;
                console.log('payload:', req.payload, '\n');

                switch (req.payload.role) {
                    case 'Admin':
                        can(['read', 'update'], ['repos', 'commits'], {
                            authorId: req.payload.id,
                        });
                        can('read', 'users', { id: req.payload.id });
                        can('manage', 'all');
                        break;

                    case 'User':
                        can(["read", "create", "update"], ["repos", "commits"], {
                            authorId: req.payload.id,
                        });
                        can("read", "users", {id: req.payload.id});
                        break;

                }
            }
        });
    } else {
        req.payload = { id: 0 };
        can('read', ['repos', 'commits'], 'all');
    }
    req.ability = new Ability(rules);
    next();
});

app.get('/login', async (req, res) => {
    res.sendFile(__dirname + '/static/login.html');
});


app.post('/login', async (req, res) => {
    const candidate = await users.findOne({
        where: {
            username: req.body.username,
            password: req.body.password,
        },
    });
    if (candidate) {
        const accessToken = jwt.sign(
            {
                id: candidate.id,
                username: candidate.username,
                role: candidate.role
            },
            accessKey,
            { expiresIn: 10 * 60 * 60 }
        );
        const refreshToken = jwt.sign(
            {
                id: candidate.id,
                username: candidate.username,
                role: candidate.role
            },
            refreshKey,
            { expiresIn: 24 * 60 * 60 }
        );
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict'
        });
        res.redirect('/resource');
    } else {
        res.redirect('/login');
    }
});

app.get('/refresh-token', async (req, res) => {
    if (req.cookies.refreshToken) {
        let isToken = await redisClient.get(req.cookies.refreshToken);
        if (isToken === null) {
            jwt.verify(req.cookies.refreshToken, refreshKey, async (err, payload) => {
                if (err) res.send(err.message);
                else if (payload) {
                    console.log('\x1b[33m%s\x1b[0m', '\nRefresh token: ' + req.cookies.refreshToken);
                    await redisClient.set(req.cookies.refreshToken, 'blocked');
                    console.log('\x1b[33m%s\x1b[0m', '\nRefresh token: ' + await redisClient.get(req.cookies.refreshToken));

                    const candidate = await users.findOne({
                        where: { id: payload.id } 
                    });
                    const newAccessToken = jwt.sign(
                        {
                            id: candidate.id,
                            username: candidate.username,
                            role: candidate.role
                        },
                        accessKey,
                        { expiresIn: 10 * 60 * 60 }
                    );
                    const newRefreshToken = jwt.sign(
                        {
                            id: candidate.id,
                            username: candidate.username,
                            role: candidate.role
                        },
                        refreshKey,
                        { expiresIn: 24 * 60 * 60 }
                    );

                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                    });

                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        sameSite: 'strict'
                    });

                    console.log('\x1b[36m%s\x1b[0m', newRefreshToken);
                    res.redirect('/resource');
                }
            });
        } else
            return res.status(401).send('Error 401: Invalid token');
    } else
        return res.status(401).send('Error 401: Unathorized');
});


app.get('/resource', async (req, res) => {
    if(req.cookies.refreshToken) {
        let isToken = await redisClient.get(req.cookies.refreshToken);
        if (isToken === null) {
            if (req.payload && req.payload.id !== 0) 
                res.status(200).send(
                    `<h2>Welcome to the resource, ${req.payload.username}!</h2>` + 
                    `<h3>Your id: ${req.payload.id}</h3>` + 
                    `<h3>Your role: ${req.payload.role}</h3>`
                );
            else 
                res.status(401).send('Error 401: Unathorized');
        }
        else {
            res.status(401).send('Error 401: Invalid token');
        }
    }
    else {
        res.status(401).send('Error 401: Unathorized');
    }
    
});

app.get('/logout', async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    if(req.cookies.refreshToken)  {
        await redisClient.set(req.cookies.refreshToken, 'blocked');
        console.log('\x1b[33m%s\x1b[0m', '\nRefresh token: ' + await redisClient.get(req.cookies.refreshToken));

    }
    res.redirect('/login');
});

app.get('/reg', (req, res) => {
    res.sendFile(__dirname + '/static/register.html');
});


app.post('/reg',async (req, res) => {
    await users.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'User',
    });
    res.redirect('/login');
});


app.get('/api/ability', (req, res) => {
    res.status(200).end(JSON.stringify(req.ability.rules));
});


app.get('/api/user',async (req, res) => {
    try {
        req.ability.throwUnlessCan('manage', 'all');
        const data = await users.findAll({
            attributes: ['id', 'username', 'email', 'role'],
        });
        res.status(200).end(JSON.stringify(data));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});


app.get('/api/user/:id',async (req, res) => {
    try {
        const userId = parseInt(req.params.id.slice(1), 10);
        req.ability.throwUnlessCan(
            'read',
            new users({ id: userId})
        );
        const user = await users.findOne({
            where: {
                id: userId,
            },
            attributes: ['id', 'username', 'email', 'role'],
        });
        if (user) {
            res.status(200).end(JSON.stringify(user));
        } else {
            res.status(404).send('Не существует такого пользователя');
        }
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }

});



app.get('/api/repos',async (req, res) => {
    const Repos = await repos.findAll();
    res.status(200).end(JSON.stringify(Repos));

});


app.get('/api/repos/:id',async (req, res) => {
    const repo = await repos.findOne({
        where: {
            id: parseInt(req.params.id.slice(1), 10)
        },
    });
    res.status(200).end(JSON.stringify(repo));

});


app.post('/api/repos/',async (req, res) => {
    try {
        req.ability.throwUnlessCan('create', 'repos');
        console.log('body: ', req.body);
        if(req.payload.role == 'Admin')
            throw new Error();
        
        const repo = await repos.create({
            name: req.body.name,
            authorId: req.payload.id,
        });
        return res.status(201).end(JSON.stringify(repo));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});


app.put('/api/repos/:id',async (req, res) => {
    try {
        console.log(req.payload.id);
        req.ability.throwUnlessCan(
            'update',
            await repos.findByPk(parseInt(req.params.id.slice(1), 10))
        );

        
        console.log('body: ', req.body);
        const repo = await repos.findOne({
            where: { id: parseInt(req.params.id.slice(1), 10), }
        });
       
        var updateRepo;
        if(repo){
            updateRepo = await repos.update(
                { name: req.body.name, },
                {
                    where: { id: parseInt(req.params.id.slice(1), 10), }
                }
            );
        }
        else
            throw new Error();
        return res.status(201).end(JSON.stringify(updateRepo));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.delete('/api/repos/:id',async (req, res) => {
    try {
        console.log(req.payload.id);
        req.ability.throwUnlessCan('manage', 'all');
        const repo = await repos.findOne({
            where: { id: parseInt(req.params.id.slice(1), 10), }
        });
        
        if(repo){
        await repos.destroy({
                where: {
                    id: parseInt(req.params.id.slice(1), 10)
                } 
            });
        }
        else
            throw new Error();
        return res.status(201).end(JSON.stringify(repo));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.get("/api/repos/:id/commits", async (req, res) => {
    try {
        const Commits = await commits.findAll({
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: parseInt(req.params.id.slice(1), 10),
                    },
                    attributes: [],
                },
            ],
        });
        return res.status(200).end(JSON.stringify(Commits));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.get("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        const commit = await commits.findOne({
            where: {
                id: parseInt(req.params.commitId.slice(1), 10),
            },
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: parseInt(req.params.id.slice(1), 10),
                    },
                    attributes: [],
                },
            ],
        });
        if (commit)
            return res.status(200).end(JSON.stringify(commit));
        else
            return res.status(404).send('[ERROR] commit not exist');
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.post("/api/repos/:id/commits", async (req, res) => {
    try {
        req.ability.throwUnlessCan(
            'create',
            await repos.findByPk(parseInt(req.params.id.slice(1), 10))
        );
        if(req.payload.role == 'Admin')
            throw new Error();
        const commit = await commits.create({
            message: req.body.message,
            repoId: parseInt(req.params.id.slice(1), 10),
        });
        return res.status(201).end(JSON.stringify(commit));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.put("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        req.ability.throwUnlessCan(
            'update',
            await repos.findByPk(parseInt(req.params.id.slice(1), 10))
        );
        await commits.update(
            {
                message: req.body.message,
            },
            {
                where: {
                    id: parseInt(req.params.commitId.slice(1), 10),
                },
                include: [
                    {
                        model: repos,
                        required: true,
                        where: {
                            id: parseInt(req.params.id.slice(1), 10),
                        },
                        attributes: [],
                    },
                ],
            }
        );

        const commit = await commits.findOne(
            { where: { id: parseInt(req.params.commitId.slice(1), 10) } });
        return res.status(200).end(JSON.stringify(commit));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }
});

app.delete("/api/repos/:id/commits/:commitId", async (req, res) => {
    try {
        req.ability.throwUnlessCan('manage', 'all');
        const commit = await commits.findOne(
            { where: { id: req.params.commitId } });

        await commits.destroy({
            where: {
                id: req.params.commitId,
            },
            include: [
                {
                    model: repos,
                    required: true,
                    where: {
                        id: req.params.id,
                    },
                    attributes: [],
                },
            ],
        });
        return res.status(200).end(JSON.stringify(commit));
    } catch (err) {
        console.log(err);
        res.status(403).send('[ERROR] not enough rights ');
    }

});


app.get('*', (req, res) => {
    res.status(404).send('404: Not Found');
});

app.listen(3000 , () => console.log(`[OK] Server running at http://localhost:3000/`));



users.hasMany(repos, { foreignKey: 'authorId' });
repos.belongsTo(users, { foreignKey: 'authorId' });

repos.hasMany(commits, { foreignKey: 'repoId' });
commits.belongsTo(repos, { foreignKey: 'repoId' });