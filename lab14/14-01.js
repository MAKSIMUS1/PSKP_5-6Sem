import { PrismaClient } from '@prisma/client';
import http from "http";
import url from "url";
import fs from 'fs';

const prisma = new PrismaClient();

let handleRequest  = async (req, res) => {
    const { method, url: requestUrl } = req;
    const { pathname } = url.parse(requestUrl);
    try {
        if (method === 'GET') {
            switch (pathname) {
                case '/':
                    const html = fs.readFileSync('14-01.html', 'utf-8');
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(html);
                    break;
                case '/api/faculties':
                    const faculties = await prisma.FACULTY.findMany();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(faculties));
                    break;
                case '/api/FluentAPI':
                    const faculty = await prisma.PULPIT.findUnique({where: {PULPIT: 'ИСиТ'},}).FACULTY_PULPIT_FACULTYToFACULTY();
                    console.log(faculty);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(faculty));
                    break;
                case '/api/teachers':
                    prisma.TEACHER.findMany().then(teachers => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(teachers));
                    });
                    break;
                case '/api/pulpits':
                    prisma.PULPIT.findMany().then(pulpits => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(pulpits));
                    });
                    break;
                case '/api/subjects':
                    prisma.SUBJECT.findMany().then(subjects => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(subjects));
                    });
                    break;
                case '/api/auditoriumstypes':
                    prisma.AUDITORIUM_TYPE.findMany().then(auditorium_types => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditorium_types));
                    });
                    break;
                case '/api/auditoriums':
                    prisma.AUDITORIUM.findMany().then(auditoriums => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                break;
                case '/api/auditoriumsWithComp1':
                    prisma.AUDITORIUM.findMany({
                        where: {
                            AUDITORIUM_NAME: {
                                endsWith: '-1'
                            }
                        }
                    }).then(auditoriums => {
                        console.log(auditoriums);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                break;
                case '/api/puplitsWithoutTeachers':
                    prisma.PULPIT.findMany(
                        {
        
                            include: {
                                TEACHER_TEACHER_PULPITToPULPIT: true
                            },
                            where: { TEACHER_TEACHER_PULPITToPULPIT: { none: {} } },
                        }
                    ).then(auditoriums => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                break;
                case '/api/pulpitsWithVladimir':
                    prisma.PULPIT.findMany(
                        {
                            include: {
                                TEACHER_TEACHER_PULPITToPULPIT: true
                            },
                            where: { TEACHER_TEACHER_PULPITToPULPIT: { some: { TEACHER_NAME: { contains: 'Владимир' } } } },
                        }
                    ).then(auditoriums => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                break;
                case '/api/auditoriumsSameCount':
                    prisma.AUDITORIUM.groupBy(
                        {
                            by: ['AUDITORIUM_CAPACITY', 'AUDITORIUM_TYPE'],
                            _count: { AUDITORIUM: true }
                        }
                    ).then(auditoriums => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(auditoriums));
                    });
                break;
                default:
                    if ((url.parse(req.url).pathname.startsWith('/api/faculties/')) && (decodeURI(url.parse(req.url).pathname.split('/')[4]) === 'subjects')) {
                        let faculty = decodeURI(url.parse(req.url).pathname.split('/')[3]);
                        console.log(faculty);
                        prisma.FACULTY.findMany(
                            {
                                where: { FACULTY: `${faculty}` },
                                include: {
                                    PULPIT_PULPIT_FACULTYToFACULTY: { select: { PULPIT: true, SUBJECT_SUBJECT_PULPITToPULPIT: { select: { SUBJECT_NAME: true } } } },
            
                                }
                            }
                        ).then(auditoriums => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(auditoriums));
                        });
                    } else if (url.parse(req.url).pathname.search('\/api\/pulpitsforhtml\/[%-я]+') != (-1)) {
                        let p = url.parse(req.url, true);
                        let r = decodeURI(p.pathname).split('/');
                        let o = r[3];
                        console.log(o);
                        if (o < 0) {
                            res.end('error');
                        }
                        let pulpits = await prisma.PULPIT.findMany({ skip: (o - 1) * 10, take: 10, include: { _count: { select: { TEACHER_TEACHER_PULPITToPULPIT: true } } } })
                        if (pulpits.length != 0) {
            
                            res.end(JSON.stringify(pulpits));
                        }
                        else {
                            res.end(JSON.stringify('invalid'));
                        }
                    } else if ((url.parse(req.url).pathname.startsWith('/api/auditoriumtypes/')) && (decodeURI(url.parse(req.url).pathname.split('/')[4]) === 'auditoriums')) {
                        let auditorium_type = decodeURI(url.parse(req.url).pathname.split('/')[3]);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        console.log(auditorium_type);
                        prisma.AUDITORIUM_TYPE.findUnique(
                            {
                                where: { AUDITORIUM_TYPE: `${auditorium_type}` },
                                select: {
                                    AUDITORIUM_TYPE: true,
                                    AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: { select: { AUDITORIUM: true } }
                                }
                            }
                        ).then(auditoriums => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(auditoriums));
                        });
                    }else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Not Found');
                    };
            };

        } else if (req.method == 'POST') {
            if (url.parse(req.url).pathname === '/api/faculties') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    if (o.PULPIT == null) {
                        prisma.FACULTY.create({
                            data: {
                                FACULTY: `${o.FACULTY}`,
                                FACULTY_NAME: `${o.FACULTY_NAME}`
                            }
                        }).then(
                            (task) => {
                                console.log(task);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Faculty":"${o.FACULTY}","Faculty_name":"${o.FACULTY_NAME}"}`);
                            }
                        ).catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в факультет"}`);
                        });
                        console.log('Нет');
                    } else {
                        prisma.FACULTY.create({
                            data: {
                                FACULTY: `${o.FACULTY}`,
                                FACULTY_NAME: `${o.FACULTY_NAME}`,
                                PULPIT_PULPIT_FACULTYToFACULTY: {
                                    create: {
                                        PULPIT: `${o.PULPIT}`,
                                        PULPIT_NAME: `${o.PULPIT_NAME}`
                                    }
                                }
                            },
                            include: { PULPIT_PULPIT_FACULTYToFACULTY: true }
                        }).then(
                            (task) => {
                                console.log(task);
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"Faculty":"${o.FACULTY}","Faculty_name":"${o.FACULTY_NAME}"}`);
                            }
                        ).catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в факультет"}`);
                        });
                        console.log('Есть')
                    }
                })
            } else if (url.parse(req.url).pathname === '/api/teachers') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.TEACHER.create({
                        data: {
                            TEACHER: `${o.TEACHER}`,
                            TEACHER_NAME: `${o.TEACHER_NAME}`,
                            PULPIT: `${o.PULPIT}`,
                        }
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"TEACHER":"${o.TEACHER}","TEACHER_NAME":"${o.TEACHER_NAME}","PULPIT":"${o.PULPIT}}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в TEACHER"}`);
                    });
    
                })
            } else if (url.parse(req.url).pathname === '/api/pulpits') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
    
                    prisma.PULPIT.create({
                        data: {
                            PULPIT: `${o.PULPIT}`,
                            PULPIT_NAME: `${o.PULPIT_NAME}`,
                            FACULTY_PULPIT_FACULTYToFACULTY: {
                                connectOrCreate: {
                                    where: {
                                        FACULTY: `${o.FACULTY}`,
                                    },
                                    create: {
                                        FACULTY: `${o.FACULTY}`,
                                        FACULTY_NAME: `${o.FACULTY_NAME}`,
                                    }
                                }
                            }
                        }
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Pulpit: ${o.PULPIT}, Pulpit_name ${o.PULPIT_NAME} Faculty":"${o.FACULTY}","Faculty_name":"${o.FACULTY_NAME}"}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в PULPIT"}`);
                    });
                    console.log('Нет');
    
                })
            } else if (url.parse(req.url).pathname === '/api/subjects') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.SUBJECT.create({
                        data: {
                            SUBJECT: `${o.SUBJECT}`,
                            SUBJECT_NAME: `${o.SUBJECT_NAME}`,
                            PULPIT: `${o.PULPIT}`,
                        }
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"SUBJECT":"${o.SUBJECT}","SUBJECT_NAME":"${o.SUBJECT_NAME}","PULPIT":"${o.PULPIT}}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в SUBJECT"}`);
                    });
    
                });
            } else if (url.parse(req.url).pathname === '/api/auditoriumstypes') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.AUDITORIUM_TYPE.create({
                        data: {
                            AUDITORIUM_TYPE: `${o.AUDITORIUM_TYPE}`,
                            AUDITORIUM_TYPENAME: `${o.AUDITORIUM_TYPENAME}`
                        }
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"AUDITORIUM_TYPE":"${o.AUDITORIUM_TYPE}","AUDITORIUM_TYPENAME":"${o.AUDITORIUM_TYPENAME}"}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в AUDITORIUM_TYPE"}`);
                    });
    
                });
            } else if (url.parse(req.url).pathname === '/api/auditoriums') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.AUDITORIUM.create({
                        data: {
                            AUDITORIUM: `${o.AUDITORIUM}`,
                            AUDITORIUM_TYPE: `${o.AUDITORIUM_TYPE}`,
                            AUDITORIUM_CAPACITY: o.AUDITORIUM_CAPACITY,
                            AUDITORIUM_NAME: `${o.AUDITORIUM_NAME}`
                        }
                    }).then(
                        (task) => {
                            console.log(task);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"AUDITORIUM:${o.AUDITORIUM}, AUDITORIUM_TYPE":"${o.AUDITORIUM_TYPE}","AUDITORIUM_CAPACITY":"${o.AUDITORIUM_CAPACITY}"AUDITORIUM_TYPENAME":"${o.AUDITORIUM_TYPE}"}`);
                        }
                    ).catch(err => {
                        console.log(err);
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(`{"error":"3","messsage":"Нарушение целостности при вставке в AUDITORIUM_TYPE"}`);
                    });
    
                });
            }
        } else if (req.method == 'PUT') {
            if (url.parse(req.url).pathname === '/api/faculties') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.FACULTY.update({
                            where: { FACULTY: `${o.FACULTY}` },
                            data: {
                                FACULTY_NAME: `${o.FACULTY_NAME}`
                            }
                        }
                    ).then(task => {
                        console.log(task);
                        if (task) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Faculty":"${o.FACULTY}","Faculty_name":"${o.FACULTY_NAME}"}`);
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода факультета для обновления не существует"}`);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        });
                });
            } else if (url.parse(req.url).pathname === '/api/pulpits') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.PULPIT.update({
                        where: { PULPIT: `${o.PULPIT}` },
                        data: {
                            PULPIT_NAME: `${o.PULPIT_NAME}`,
                            FACULTY: `${o.FACULTY}`
                        }
                    }).then(task => {
                        console.log(task);
                        if (task) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"Pulpit":"${o.PULPIT}","Pulpit_name":"${o.PULPIT_NAME}","Faculty":"${o.FACULTY}"}`);
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(`{"error":2,"message":"Такого кода кафедры для обновления не существует"}`);
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
            } else if (url.parse(req.url).pathname === '/api/subjects') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.sUBJECT.update({
                        where: { SUBJECT: `${o.SUBJECT}` },
                        data: {
                            SUBJECT_NAME: `${o.SUBJECT_NAME}`,
                            PULPIT: `${o.PULPIT}`
                        }
                    })
                        .then(task => {
                            if (task == 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такого предмета для обновления не существует"}`);
                            } else {
                                res.end(`{"subject":"${o.SUBJECT}","subject_name":"${o.SUBJECT_NAME}","pulpit":"${o.PULPIT}"}`);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
            } else if (url.parse(req.url).pathname === '/api/transaction') {
    
                const result = await prisma.$transaction(async (tras) => {
                    await tras.AUDITORIUM.updateMany({
                        data: {
                            AUDITORIUM_CAPACITY: { increment: 100 }
                        }
                    })
                    console.log(await tras.AUDITORIUM.findMany())
                    throw 'rollback transaction'
                }).catch(err => {
                    console.log(err);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(err));
                })
    
    
            } else if (url.parse(req.url).pathname === '/api/teachers') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.tEACHER.update({
                        where: { TEACHER: `${o.TEACHER}` },
                        data: {
                            TEACHER_NAME: `${o.TEACHER_NAME}`,
                            PULPIT: `${o.PULPIT}`
                        }
                    })
                        .then(task => {
                            console.log(task);
                            if (task == 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такого учителя для обновления не существует"}`);
                            } else {
                                res.end(`{"Teacher":"${o.TEACHER}","Teacher_name":"${o.TEACHER_NAME}","Pulpit":"${o.PULPIT}"}`);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
            } else if (url.parse(req.url).pathname === '/api/auditoriumstypes') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.aUDITORIUM_TYPE.update({
                        where: { AUDITORIUM_TYPE: `${o.AUDITORIUM_TYPE}` },
                        data: {
                            AUDITORIUM_TYPENAME: `${o.AUDITORIUM_TYPENAME}`
                        }
                    })
                        .then(task => {
                            if (task == 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такого типа аудитории для обновления не существует"}`);
                            } else {
                                res.end(`{"Audtiorium_type":"${o.AUDITORIUM_TYPE}","Auditorium_typename":"${o.AUDITORIUM_TYPENAME}"}`);
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                        })
                });
            } else if (url.parse(req.url).pathname === '/api/auditoriums') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let o = JSON.parse(body);
                    prisma.aUDITORIUM.update({
                        where: { AUDITORIUM: `${o.AUDITORIUM}` },
                        data: {
                            AUDITORIUM_NAME: `${o.AUDITORIUM}`,
                            AUDITORIUM_CAPACITY: `${o.AUDITORIUM_CAPACITY}`,
                            AUDITORIUM_TYPE: `${o.AUDITORIUM_TYPE}`,
                        }
                    })
                        .then(task => {
                            console.log(task);
                            if (task == 0) {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(`{"error":2,"message":"Такой аудитории для обновления не существует"}`);
                            } else {
                                res.end(`{"Auditorium":"${o.AUDITORIUM}","Auditorium_name":"${o.AUDITORIUM_NAME}","Auditorium_capacity":${o.AUDITORIUM_CAPACITY}, "Auditorium_type":${o.AUDITORIUM_TYPE}}`);
                            }
                        })
                        .catch(err => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(err));
                            console.log(err);
                        })
                });
            }
        } else if (req.method == 'DELETE') {
            console.log(url.parse(req.url).pathname);
            if (url.parse(req.url).pathname.search('\/api\/faculties\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.FACULTY.findMany({ where: { FACULTY: `${o}` } })
                if (que) {
                    prisma.FACULTY.delete({ where: { FACULTY: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"FACULTY":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
    
            } else if (url.parse(req.url).pathname.search('\/api\/pulpits\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.PULPIT.findMany({ where: { PULPIT: `${o}` } })
                if (que) {
                    prisma.PULPIT.delete({ where: { PULPIT: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"PULPIT":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
    
            } else if (url.parse(req.url).pathname.search('\/api\/teachers\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.TEACHER.findMany({ where: { TEACHER: `${o}` } })
                if (que) {
                    prisma.TEACHER.delete({ where: { TEACHER: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"TEACHER":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
            } else if (url.parse(req.url).pathname.search('\/api\/subjects\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.SUBJECT.findMany({ where: { SUBJECT: `${o}` } })
                if (que) {
                    prisma.SUBJECT.delete({ where: { SUBJECT: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"SUBJECT":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
    
            } else if (url.parse(req.url).pathname.search('\/api\/auditoriumstypes\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.AUDITORIUM_TYPE.findMany({ where: { AUDITORIUM_TYPE: `${o}` } })
                if (que) {
                    prisma.AUDITORIUM_TYPE.delete({ where: { AUDITORIUM_TYPE: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"AUDITORIUM_TYPE":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
            } else if (url.parse(req.url).pathname.search('\/api\/auditoriums\/[%-я]+') != (-1)) {
                let p = url.parse(req.url, true);
                let r = decodeURI(p.pathname).split('/');
                let o = r[3];
                const que = prisma.AUDITORIUM.findMany({ where: { AUDITORIUM: `${o}` } })
                if (que) {
                    prisma.AUDITORIUM.delete({ where: { AUDITORIUM: o } }).then(task => {
                        console.log(task);
    
                        res.end(`{"AUDITORIUM":"${o}"}`);
    
                    }).catch(err => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(err));
                    });
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

const server = http.createServer(handleRequest);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});