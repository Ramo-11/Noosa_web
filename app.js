// modules
const express = require("express")
const session = require("express-session")

const passport = require("passport")
require("./server/local")

const router = require("./server/router")
const app = express()

const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const connectDB = require("./server/database/connection")
const MongoStore = require("connect-mongo")

const { getLoggerType } = require("./utils/loggers/loggerType")
generalLogger = getLoggerType("general")

require("dotenv").config()

// Connect the app to the database
connectDB()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"))

app.use(cookieParser())

app.use(session({
    secret: "kljasoiuj3io43@$3klnklv4515451$232s:",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/", router)

app.set("view engine", "ejs")

app.listen(process.env.PORT, () => generalLogger.info(`server running on port: http://localhost:${process.env.PORT}`))

// show 404 page if client is trying to access a page that doesn"t exist
app.use((req,res) => res.status(404).render("404"))