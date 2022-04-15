const nodemailer = require('nodemailer')

exports.sendemail = async (req, res) => {
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
        to: "oabdela@iu.edu",
        subject: `Message from ${email}`,
        text: content
    }

    mailTransporter.sendMail(details, (error) => {
        if(!error)
            return res.status(200).send({message: "Message was sent successfully"})

        else {
            console.log("BIG ERROR: ", error)
            return res.status(400).send({message: "Message was not sent"})
        }
    })
}