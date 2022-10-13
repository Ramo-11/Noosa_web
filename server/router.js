const express = require("express")
const route = express.Router()

const {isLoggedIn, isLoggedOut, logUserIn, logUserOut } = require("./local")

const { createUser, findUser, updateUser, deleteUser, change_password } = require("./controllers/UserController")
const { createProject, getProjects } = require("./controllers/ProjectController")
const sendEmail = require("./controllers/mailController")

const { getLoggerType } = require("../utils/loggers/loggerType")
generalLogger = getLoggerType("general")
authLogger = getLoggerType("authentication")

const multer = require("./userImage/multer");
const { uploadImage } = require("./userImage/imageHandler")
const { create } = require("connect-mongo")

/**
 * @description home route
 * @method GET /
 */
route.get("/", (req, res) => res.render("index", { user: res.req.user }))

/**
 * @description about route
 * @method GET /about
 */
route.get("/about", (req, res) => res.render("about", { user: res.req.user }))

/**
 * @description contact route
 * @method GET /contact
 */
route.get("/contact", (req, res) => res.render("contact", { user: res.req.user }))

/**
 * @description signup and login route
 * @method GET /signup_and_login
 */
route.get("/signup_and_login", isLoggedOut, (req, res) => res.render("signup_and_login"))

/**
 * @description personal profile route
 * @method GET /profile
 */
 route.get("/profile", isLoggedIn, (req, res) => res.render("profile", { user: res.req.user }))

// Authentication API routes
route.post("/api/signup", isLoggedOut, createUser)

route.post("/api/updateUserInfo", updateUser)

route.post("/api/login", logUserIn)

route.post("/api/logout", logUserOut)

route.post("/api/change_password", change_password)

// User Profile Image API Routes
route.post("/api/profilePicture/upload", multer.single("image"), uploadImage)

route.post("/api/sendemail", sendEmail)

// Project API routes
route.post("/api/createProject", createProject)

route.get("/api/getProjects", getProjects)

module.exports = route