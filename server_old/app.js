require('dotenv').config()
const cors = require('cors')
const express = require('express')
const database = require('./database/query')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json());

app.use(cors({origin: 'http://localhost:8080', credentials: true}))
app.use(cookieParser())
app.use('/api', router)

function start () {
    app.listen(process.env.PORT, async () => {
        console.log(`Server has been \x1b[32mstarted\x1b[0m on \x1b[36m${process.env.API_URL}\x1b[0m ...`)
        await database.checkConnect()
    })
}

start()