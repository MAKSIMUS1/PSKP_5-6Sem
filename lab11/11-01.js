//http-server
const sql=require('mssql');
const url = require("url");
const fs = require("fs");
const http = require("http");

let config={
    user: "student",
    password: "fitfit",
    database: "KMO",
    server: "MAKSIM",
    trustServerCertificate: true,
    pool: {
        min:4,
        max:10
    }
}

const pool = new sql.ConnectionPool(config);
const defineTable = (str) => {
    switch (str) {
        case "faculties":
            return "FACULTY";
        case "pulpits":
            return "PULPIT";
        case "subjects":
            return "SUBJECT";
        case "auditoriumstypes":
            return "AUDITORIUM_TYPE";
        case "auditoriums":
            return "AUDITORIUM";
        default:
            break;
    }
};
http.createServer((req,resp)=>{
    if (req.method=='GET') {
        resp.writeHead(400, { "Content-Type": "application/json" });
        let regexp1=new RegExp('/api/faculty/[a-zA-Zа-яА-Я0-9]{0,15}/pulpits');
        let regexp2=new RegExp('/api/auditoriumstypes/[a-zA-Zа-яА-Я0-9\s]{0,15}/auditoriums')
        if (regexp1.test(decodeURI(url.parse(req.url).pathname))) {
            let code = decodeURI(url.parse(req.url).pathname.split('/')[3]);
            pool
                .connect()
                .then(connection => {
                    return connection.query(
                        `select * from PULPIT where FACULTY='${code}'`
                    );
                })
                .then(result => {
                    console.log('Result: ', result.recordset);
                    resp.end(JSON.stringify(result.recordset));
                })
                .catch(e => {
                    resp.end(JSON.stringify({ id: 400, name: `Error in GET request` }));
                })
                .finally(() => {
                    pool.close();
                });
        } else if (regexp2.test(decodeURI(url.parse(req.url).pathname))) {
            let code = decodeURI(url.parse(req.url).pathname.split('/')[3]);
            pool
                .connect()
                .then(connection => {
                    return connection.query(
                        `select * from AUDITORIUM where AUDITORIUM_TYPE='${code}'`
                    );
                })
                .then(result => {
                    console.log('Result: ', result.recordset);
                    resp.end(JSON.stringify(result.recordset));
                })
                .catch(e => {
                    resp.end(JSON.stringify({ id: 400, name: `Error in GET request` }));
                })
                .finally(() => {
                    pool.close();
                });
        }
        else if (url.parse(req.url).pathname === "/") {
            fs.readFile("11-01.html", (err, data) => {
                if (err) {
                    console.log("Error: ", err.stack);
                    resp.writeHead(400, { "Content-Type": "application/json" });
                    resp.end(JSON.stringify({ id: 400, name: "File not found" }));
                }
                resp.writeHead(200, { "Content-Type": "text/html" });
                resp.end(data);
            });
        }
        else if (url.parse(req.url).pathname.includes("/api/")!==null) {
            const table = defineTable(url.parse(req.url).pathname.split("/")[2]);
            pool
                .connect()
                .then((connection) => {
                    return connection.query(`select * from ${table}`);
                })
                .then((result) => {

                    console.log("Result: ", result.recordset);
                    resp.end(JSON.stringify(result.recordset));
                })
                .catch((err) => {
                    console.log("Error: ", err.stack);
                    resp.end(
                        JSON.stringify({ id: 400, name: `Error: GET data from ${table}` })
                    );
                })
                .finally(() => {
                    pool.close();
                });
        }
    };
    if (req.method=='POST') {
        if (url.parse(req.url).pathname.includes("/api/")) {
            resp.writeHead(200, { "Content-Type": "application/json" });
            const table = defineTable(url.parse(req.url).pathname.split("/")[2]);
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                const item = JSON.parse(data);
                let keys = "";
                let values = "";
                let objKeysArr = Object.keys(item);
                for (let i = 0; i < objKeysArr.length; ++i) {
                    let key = objKeysArr[i];
                    if (i != 0) {
                        keys += ` , ${key} `;
                        values += ` , '${item[key]}' `;
                    } else {
                        keys += ` ${key} `;
                        values += ` '${item[key]}' `;
                    }
                }

                pool
                    .connect()
                    .then((connection) => {
                        console.log(`insert into ${table} (${keys}) values (${values})`);
                        return connection.query(
                            `insert into ${table} (${keys}) values (${values})`
                        );
                    })
                    .then((result) => {
                        console.log("New item: ", item);
                        resp.end(JSON.stringify(item));
                    })
                    .catch((err) => {
                        console.log("Error: ", err.stack);
                        resp.end(
                            JSON.stringify({
                                id: 400,
                                name: `Error: INSERT data into ${table}`,
                            })
                        );
                    })
                    .finally(() => {
                        pool.close();
                    });
            });
        }
    };

    if (req.method=='PUT') {
        if (url.parse(req.url).pathname.includes("/api/")) {
            const table = defineTable(url.parse(req.url).pathname.split("/")[2]);
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            });
            req.on("end", () => {
                const item = JSON.parse(data);
                let updateStr = "";
                let objKeysArr = Object.keys(item);
                for (let i = 0; i < objKeysArr.length; ++i) {
                    let key = objKeysArr[i];
                    if (i != 0) {
                        updateStr += `,${key}='${item[key]}'`;
                    } else {
                        updateStr += `${key}='${item[key]}'`;
                    }
                }

                pool
                    .connect()
                    .then((connection) => {
                        console.log(
                            `update ${table} set ${updateStr} where ${objKeysArr[0]}='${item[objKeysArr[0]]
                            }'`
                        );
                        return connection.query(
                            `update ${table} set ${updateStr} where ${objKeysArr[0]}='${item[objKeysArr[0]]
                            }'`
                        );
                    })
                    .then((result) => {
                        console.log("Updated item: ", item);
                        resp.end(JSON.stringify(item));
                    })
                    .catch((err) => {
                        console.log("Error: ", err.stack);
                        resp.end(
                            JSON.stringify({
                                id: 400,
                                name: `Error: UPDATE data from ${table}`,
                            })
                        );
                    })
                    .finally(() => {
                        pool.close();
                    });
            });
        }
    }

    if (req.method=='DELETE') {
        if (url.parse(req.url).pathname.includes("/api/")) {
            const table = defineTable(url.parse(req.url).pathname.split("/")[2]);
            const primaryKey = decodeURI(url.parse(req.url).pathname).split("/")[3];
            pool
                .connect()
                .then((connection) => {
                    console.log(`delete from ${table} where ${table}.${table}='${primaryKey}'`);
                    return connection.query(
                        `delete from ${table} where ${table}.${table}='${primaryKey}'`
                    );
                })
                .then((result) => {
                    console.log("Deleted from ", table);
                    resp.end(`Deleted from ${table}`);
                })
                .catch((err) => {
                    console.log("Error: ", err.stack);
                    resp.end(
                        JSON.stringify({ id: 400, name: `Error: DELETE data from ${table}` })
                    );
                })
                .finally(() => {
                    pool.close();
                });
        }
    }
}).listen(3000);
