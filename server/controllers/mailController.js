const nodemailer = require("nodemailer")
const { getLoggerType } = require("../../utils/loggers/loggerType")
mailLogger = getLoggerType("mail")

async function sendEmail(req, res) {
    const { fullName, email, subject, description } = req.body

    if (!fullName || !email || !subject || !description) {
        mailLogger.error("Unable to send message")
        mailLogger.debug("One or more fields are empty")
        return res.status(400).send({ message: "Error: All fields must be completed" })
    }

    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "omarh5877@gmail.com",
            pass: "ptthrosqnestbmtu"
        }
    })

    let details = {
        from: email,
        to: "omarh5877@gmail.com",      // This should ultimately be the Noosa email: support@noosa.com
        subject: `Message from ${fullName}: subject: ${subject}`,
        text: description
    }

    mailTransporter.sendMail(details, (error) => {
        if (!error) { 
            mailLogger.info("email was sent successfully from contact page")
            return res.status(200).send({ message: "Message was sent successfully" })
        }

        else {
            mailLogger.error("Unable to send message")
            mailLogger.debug(error)
            return res.status(400).send({ message: "Message was not sent" })
        }
    })
}

module.exports = sendEmail