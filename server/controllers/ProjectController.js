const project = require("../../model/project")
const user = require("../../model/user")
const { ObjectId } = require('mongodb');

const { getLoggerType } = require("../../utils/loggers/loggerType")
authLogger = getLoggerType("authentication")

async function createProject(req, res) {
    const { title, date, description} = req.body
    var userID = req.user._id

    if(!title || !date || !description) {
        authLogger.error("one of the required fields are empty, cannot create project")
        return res.status(400).send({message: "Error: one of the required fields are empty"})
    }

    userID = ObjectId(userID)

    console.log("User ID: " + userID)
    console.log("type of User ID: " + typeof userID)

    try {
        await project.create({
            author: userID,
            title,
            date,
            description
        }) 

        authLogger.info('Project with title [' + title + '] was created successfully')
        return res.status(200).send({message: "Project was created successfully"})
    } catch (error) {
        authLogger.error("Unable to create project")
        return res.status(400).send({message: "Unable to create project: " + error})
    }
}

async function findProject(req, res) {
    const found_project = await project.findById('6343b0c7516604efa32d4da5').populate({ path: 'author', select: 'name'})

    console.log("project: " + found_project)
    return res.status(200).send({message: "okay"})
}

module.exports = { createProject, findProject }