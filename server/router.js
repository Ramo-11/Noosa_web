const express = require("express")
const route = express.Router()

const {isLoggedIn, isLoggedOut, logUserIn, logUserOut } = require("./local")

const { createUser, getUsers, updateUser, deleteUser, change_password } = require("./controllers/UserController")
const { createProject, getProjects } = require("./controllers/ProjectController")
const sendEmail = require("./controllers/mailController")

const { getLoggerType } = require("../utils/loggers/loggerType")
generalLogger = getLoggerType("general")
authLogger = getLoggerType("authentication")

const multer = require("./pictureHandlers/multer");
const { uploadUserProfilePicture, uploadProjectPicture } = require("./pictureHandlers/pictureUploader")

/**
 * @description home route
 * @method GET /
 */
route.get("/", (req, res) => res.render("index", { user: res.req.user }))

/**
 * @description create a project route
 * @method GET /create_project
 */
 route.get("/create_project", (req, res) => res.render("create_project", { user: res.req.user }))

/**
 * @description retrieve personal projects route
 * @method GET /personal_projects
 */
 route.get("/personal_projects", (req, res) => res.render("personal_projects", { user: res.req.user }))

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

// User API routes
route.post("/api/signup", isLoggedOut, createUser)
route.post("/api/updateUserInfo", multer.single("picture"), updateUser)
route.post("/api/login", logUserIn)
route.post("/api/logout", logUserOut)
route.post("/api/change_password", change_password)
route.post("/api/profilePicture/upload", multer.single("image"), uploadUserProfilePicture)
route.get("/api/getUsers", getUsers)

route.post("/api/sendemail", sendEmail)

// Project API routes
route.post("/api/createProject", multer.single("picture"), createProject)
route.get("/api/getProjects", getProjects)

module.exports = route