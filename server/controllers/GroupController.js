const groupModel = require("../../model/group")
const bcrypt = require("bcryptjs");
const { send } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");
const JWT_SECRET = "kasdkfjioe.,mncv xkio@#@#%#$#nbsw#$knlk23@@3kln3%#4323nk"

// create new groupModel
exports.createGroup = async (req, res) => {
    const { name, total_duration, start_date, individual_payment, user } = req.body

    var users = []
    users.append(user)

    try {
        await groupModel.create({
            name,
            total_duration,
            start_date,
            individual_payment,
            users
        }) 
        return res.status(200).send({message: "group was created successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to create group"})
    }
}

exports.findGroup = async (req, res) => {
    try {
        const group = await groupModel.find()
        return res.json(group)
    } catch (error) {
        return res.status(400).send({message: "unable to get data from database"})
    }
}

exports.updateGroup = async (req, res) => {
    const groupID = req.params.id
    try {
        await groupModel.findByIdAndUpdate(groupID, req.body)
        return res.status(200).send({message: "group was updated successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to update group"})
    }
}

exports.deleteGroup = async (req, res) => {
    const groupID = req.params.id
    try {
        await groupModel.findByIdAndDelete(groupID)
        return res.status(200).send({message: "group were deleted successfully"})
    } catch (error) {
        return res.status(400).send({message: "unable to delete group"})
    }
}