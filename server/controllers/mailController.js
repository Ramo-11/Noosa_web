const nodemailer = require("nodemailer")
const { getLoggerType } = require("../../utils/loggers/loggerType")
mailLogger = getLoggerType("mail")

async function sendEmail(req, res) {
    const {first_name, last_name, email, content} = req.body

    let mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "omarh5877@gmail.com",
            pass: "ptthrosqnestbmtu"
        }
    })

    let details = {
        from: email,
        to: "balhusni@iu.com",      // This should ultimately be the Noosa email: support@noosa.com
        subject: `Message from ${email}`,
        text: content
    }

    mailTransporter.sendMail(details, (error) => {
        if(!error) { 
            mailLogger.info("email was sent successfully from contact page")
            return res.status(200).send({message: "Message was sent successfully"})
        }

        else {
            mailLogger.error(error)
            return res.status(400).send({message: "Message was not sent"})
        }
    })
}

module.exports = sendEmail