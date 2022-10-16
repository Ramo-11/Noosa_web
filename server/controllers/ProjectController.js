const project = require("../../model/project")
const user = require("../../model/user")
const cloudinary = require("../pictureHandlers/cloudinary")
const { getLoggerType } = require("../../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")
projectLogger = getLoggerType("project")

async function createProject(req, res) {
    const picture = req.file.path
    const { title, date, description, link } = req.body
    const userID = req.user._id

    if(!title || !date || !description) {
        projectLogger.error("one of the required fields are empty, cannot create project")
        return res.status(400).send({ message: "Error: one of the required fields are empty" })
    }

    try {
        const user_ = await user.findById(userID)
        const result = await cloudinary.uploader.upload(picture, { folder: user_.name + "_projects" })

        await project.create({
            author: userID,
            title,
            date,
            description,
            link,
            picture: result.secure_url,
            cloudinary_id: result.public_id
        }) 
    
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
        const found_projects = await project.find({ author: userID }, { title: 1, date: 1, picture: 1, description: 1 })

        projectLogger.info("Projects were retrieved successfully")
        res.status(200)
        return res.json(found_projects)
    } catch (error) {
        projectLogger.error("Unable to retrieve projects")
        projectLogger.debug("Unable to retrieve projects: " + error)
        return res.status(400).send({ message: "Unable to retrieve projects for this user" })
    }
}

module.exports = { createProject, getProjects }