const nodemailer = require("nodemailer");

const sendEmail =async (options) => {
    //1-Create Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    //2-Define mail options
    const mailOpts = {
        from:'Design Club App <designclub440@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    //3-Send email
    await transporter.sendMail(mailOpts);
}

module.exports=sendEmail;