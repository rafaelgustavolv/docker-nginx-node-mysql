const express = require('express')
const fetch = require('node-fetch')
const mysql = require('mysql')

const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'app_db'
}

const connection = mysql.createConnection(config)

const sqlTable = `CREATE TABLE IF NOT EXISTS \`people\` (
    \`id\` int(11) NOT NULL auto_increment,
    \`name\` varchar(250)  NOT NULL default '',
    PRIMARY KEY  (\`id\`)
);`
connection.query(sqlTable)

const getPeople = async () => {
    const res = await fetch(`https://api.namefake.com/portuguese-brazil/random/`)
    return await res.json()
}

const insert = async (people) => {
    const sql = `INSERT INTO people(name) values(?)`
    return await connection.query(sql, [people.name])
}

const pageSuccess = (people) => {
    let html = [
        '<h1>Full Cycle Rocks!</h1>',
        '<ul>',
    ]

    people.forEach(item => {
        html.push('<li>' + item.name + '</li>')
    })

    html.push('</ul>')

    return html.join('')
}

const pageError = () => {
    return '<h1>Error :(</h1>'
}

app.get('/', async (req, res) => {
    const people = await getPeople()
    const resultInsert = await insert(people)

    const sql = `SELECT name FROM people`
    connection.query(
        sql,
        (error, results, fields) => {
            if (error) {
                res.send(pageError())
            } else {
                res.send(pageSuccess(results))
            }
        }
    )
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})