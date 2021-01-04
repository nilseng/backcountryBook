import express from "express"
import path from 'path'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import sslRedirect from 'heroku-ssl-redirect'

import { connectToMongoDb } from "./database/databaseSetup"
import tripsRouter from "./routes/trips"
import imagesRouter from "./routes/images"
import usersRouter from "./routes/users"
import peaksRouter from "./routes/peaks"

dotenv.config()

const app = express()

app.use(sslRedirect())

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json())
app.use(morgan("tiny"))

app.use("/api", tripsRouter)
app.use("/api", imagesRouter)
app.use("/api", usersRouter)
app.use("/api", peaksRouter)

app.use(express.static(path.join(__dirname, '../../client/build')))

connectToMongoDb().then(_ => {
    app.listen({ port: process.env.PORT || 4000 }, () => console.log(`The server is now running on port ${process.env.PORT || 4000}`))
})

app.use('/*', express.static(path.join(__dirname, '../../client/build', 'index.html')))