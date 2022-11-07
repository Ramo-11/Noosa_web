const express = require("express")
const route = express.Router()

const { isLoggedIn, isLoggedOut, logUserIn, logUserOut } = require("./local")

const { createUser, getUsers, updateUser } = require("./controllers/UserController")
const { createProject, editProjectRedirect, editProject, deleteProject, getProjects, getUserProjects } = require("./controllers/ProjectController")
const sendEmail = require("./controllers/mailController")

const multer = require("./pictureHandlers/multer");

/**
 * @description home route
 * @method GET /
 */
route.get("/", (req, res) => res.render("index", { user: res.req.user }))

/**
 * @description create a project route
 * @method GET /create_project
 */
 route.get("/create_project", isLoggedIn, (req, res) => res.render("create_project", { user: res.req.user }))

/**
 * @description retrieve personal projects route
 * @method GET /personal_projects
 */
 route.get("/personal_projects", isLoggedIn, (req, res) => res.render("personal_projects", { user: res.req.user }))

 /**
 * @description retrieve user's projects route
 * @method GET /user_projects
 */
  route.get("/user_projects", (req, res) =>  {
    const user_ = req.session.message[req.session.message.length - 1]
    res.render("user_projects", { user: res.req.user, secondary_user: user_, projects: req.session.message }) 
  })

 /**
 * @description retrieve edit project page
 * @method GET /edit_project
 */
  route.get("/edit_project", isLoggedIn, (req, res) => res.render("edit_project", { user: res.req.user, project: req.session.message}))

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
route.post("/api/updateUserInfo", isLoggedIn, multer.single("picture"), updateUser)
route.post("/api/login", logUserIn)
route.post("/api/logout", logUserOut)
route.get("/api/getUsers", getUsers)

// Send email API
route.post("/api/sendemail", sendEmail)

// Project API routes
route.post("/api/createProject", isLoggedIn, multer.single("picture"), createProject)
route.put("/api/editProject", isLoggedIn, multer.single("picture"), editProject)
route.get("/api/editProjectRedirect/:projectID", isLoggedIn, editProjectRedirect)
route.delete("/api/deleteProject/:projectID", isLoggedIn, deleteProject)

route.get("/api/getProjects", isLoggedIn, getProjects)
route.get("/api/getUserProjects/:email", isLoggedIn, getUserProjects)

module.exports = route