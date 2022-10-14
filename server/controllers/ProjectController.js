const project = require("../../model/project")
const { getLoggerType } = require("../../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")
projectLogger = getLoggerType("project")

async function createProject(req, res) {
    const { title, date, description} = req.body
    var userID = req.user._id

    if(!title || !date || !description) {
        projectLogger.error("one of the required fields are empty, cannot create project")
        return res.status(400).send({message: "Error: one of the required fields are empty"})
    }

    try {
        await project.create({
            author: userID,
            title,
            date,
            description
        }) 

        projectLogger.info('Project with title [' + title + '] was created successfully')
        return res.status(200).send({message: "Project was created successfully"})
    } catch (error) {
        projectLogger.debug("Unable to create project: " + error)
        projectLogger.error("Unable to create project")
        return res.status(400).send({ message: "Unable to create project" })
    }
}

async function getProjects(req, res) {

    try {
        const userID = req.user._id
        const found_projects = await project.find({ author: userID }, { title: 1, date: 1, picture: 1, description: 1 })

        projectLogger.info('Projects were retrieved successfully')
        res.status(200)
        return res.json(found_projects)
    } catch (error) {
        projectLogger.debug("Unable to retrieve projects: " + error)
        projectLogger.error("Unable to retrieve projects")
        return res.status(400).send({ message: "Unable to retrieve projects for this user" })
    }
}

module.exports = { createProject, getProjects }