const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {
    // Create a transporter using Ethereal Email for testing if no credentials provided
    let transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Generate test SMTP service account from ethereal.email
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        console.log('Using Ethereal Email for testing');
        console.log(`Ethereal User: ${testAccount.user}`);
        console.log(`Ethereal Pass: ${testAccount.pass}`);
    }

    const message = {
        from: `${process.env.FROM_NAME || 'SkillUp'} <${process.env.FROM_EMAIL || 'noreply@skillup.com'}>`,
        to: options.to || options.email,
        subject: options.subject,
        text: options.text || options.message,
        html: options.html,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    if (!process.env.SMTP_HOST) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
