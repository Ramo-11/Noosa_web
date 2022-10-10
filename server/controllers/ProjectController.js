const project = require("../../model/project")

const { getLoggerType } = require("../../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")

async function createProject(req, res) {
    const { title, date, description} = req.body

    if(!title || !date || !description) {
        authLogger.error("one of the required fields are empty, cannot create project")
        return res.status(400).send({message: "Error: one of the required fields are empty"})
    }

    try {
        await project.create({
            title,
            date,
            description
        }) 
        authLogger.info('Project with title [' + title + '] was created successfully')
        return res.status(200).send({message: "Project was created successfully"})
    } catch (error) {
        authLogger.error("Unable to create project")
        return res.status(400).send({message: "Unable to create project"})
    }
}

module.exports = { createProject }