const nodemailer = require("nodemailer")

module.exports = async (email,subject,text) => {
    try {
        const transportor = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.PORT),
            secure:  Boolean(process.env.SECURE),
            auth : {
                user: process.env.USER,
                pass: process.env.PASS
        }
        })
        await transportor.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        });
        console.log("Email sent Successfully")
    }catch (err) {
        console.log("Email not send")
        console.log(err)
    }
}