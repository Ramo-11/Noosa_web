const project = require("../../model/project")
const user = require("../../model/user")
const cloudinary = require("../pictureHandlers/cloudinary")
const { getLoggerType } = require("../../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")
projectLogger = getLoggerType("project")

async function createProject(req, res) {
        const { title, date, description, link } = req.body
        const userID = req.user._id

        if(!title || !date || !description) {
            projectLogger.error("one or more of the required fields are empty, cannot create project")
            return res.status(400).send({ message: "Error: one or more of the required fields are empty" })
        }

    try { 
        // If a picture is submitted
        if (req.file != undefined) {
            const picture = req.file.path
            const user_ = await user.findById(userID)
            const result = await cloudinary.uploader.upload(picture, { folder: user_.name + "/projects" })
            await project.create({
                author: userID,
                title,
                date,
                description,
                link,
                picture: result.secure_url,
                cloudinary_id: result.public_id
            }) 
        } else {
            await project.create({
                author: userID,
                title,
                date,
                description,
                link
            })
        }

        projectLogger.info('Project with title [' + title + '] was created successfully')
        return res.status(200).send({ message: "Project was created successfully" })
    } catch (error) {
        projectLogger.error("Unable to create project")
        projectLogger.debug("Unable to create project: " + error)
        return res.status(400).send({ message: "Unable to create project" })
    }
}

async function getProjects(req, res) {
    try {
        const userID = req.user._id
        const found_projects = await project.find({ author: userID }, { title: 1, date: 1, picture: 1, description: 1, link: 1 })

        projectLogger.info("Projects were retrieved successfully")
        res.status(200)
        return res.json(found_projects)
    } catch (error) {
        projectLogger.error("Unable to retrieve projects")
        projectLogger.debug("Unable to retrieve projects: " + error)
        return res.status(400).send({ message: "Unable to retrieve projects for this user" })
    }
}

async function getUserProjects(req, res) {
    try {
        const email = req.params.email
        const targetUser = await user.findOne( { email: email }, { _id: 1, name: 1, profilePicture: 1 } )
        const targetUserID = targetUser._id

        const target_obj = await project.find( { author: targetUserID } , { title: 1, date: 1, picture: 1, description: 1, link: 1 })

        const userObj = { 
            "name": targetUser.name,
            "profilePicture": targetUser.profilePicture
        }

        target_obj.push(userObj)

        req.session.message = target_obj

        res.status(200)
        return res.redirect("/user_projects")
        // projectLogger.info("Projects were retrieved successfully")
    } catch (error) {
        projectLogger.error("Unable to retrieve projects")
        projectLogger.debug("Unable to retrieve projects: " + error)
        return res.status(400).send({ message: "Unable to retrieve projects for this user" })
    }
}

module.exports = { createProject, getProjects, getUserProjects }