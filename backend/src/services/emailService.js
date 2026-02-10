const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    // For development, using ethereal email (fake SMTP service)
    // In production, replace with real SMTP credentials
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || 'test@skillup.com',
            pass: process.env.EMAIL_PASS || 'testpassword'
        }
    });
};

// Send payment confirmation to student
const sendStudentPaymentConfirmation = async (studentEmail, studentName, courseName, amount, courseId) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"SkillUp Learning Platform" <noreply@skillup.com>',
            to: studentEmail,
            subject: `Payment Confirmation - ${courseName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .amount { font-size: 24px; font-weight: bold; color: #ff6b35; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Payment Successful!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${studentName}</strong>,</p>
              
              <p>Your payment has been successfully processed! You now have full access to:</p>
              
              <h2>${courseName}</h2>
              
              <p>Payment Amount: <span class="amount">$${amount.toFixed(2)}</span></p>
              
              <p><strong>What's included:</strong></p>
              <ul>
                <li>✅ All course materials and lessons</li>
                <li>✅ Assignments and exams</li>
                <li>✅ Direct instructor support</li>
                <li>✅ Lifetime access to course content</li>
                <li>✅ Certificate upon completion</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="http://localhost:3000/course/${courseId}" class="button">Start Learning Now →</a>
              </p>
              
              <p>Thank you for choosing SkillUp! We're excited to be part of your learning journey.</p>
              
              <p>Happy Learning! 🚀</p>
              
              <p>Best regards,<br>The SkillUp Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>&copy; 2024 SkillUp Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Student email sent:', info.messageId);

        // Log preview URL for development (Ethereal)
        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('❌ Error sending student email:', error);
        // Don't throw error - payment should succeed even if email fails
        return null;
    }
};

// Send enrollment notification to instructor
const sendInstructorPaymentNotification = async (instructorEmail, instructorName, studentName, courseName, amount) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"SkillUp Learning Platform" <noreply@skillup.com>',
            to: instructorEmail,
            subject: `New Student Enrollment - ${courseName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #fff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .amount { font-size: 20px; font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New Student Enrolled!</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${instructorName}</strong>,</p>
              
              <p>Great news! You have a new student in your course.</p>
              
              <div class="highlight">
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Course:</strong> ${courseName}</p>
                <p><strong>Payment Received:</strong> <span class="amount">$${amount.toFixed(2)}</span></p>
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>The student now has access to all course materials</li>
                <li>You can view them in your student roster</li>
                <li>They may start submitting assignments soon</li>
              </ul>
              
              <p>Keep up the excellent work! Your courses are making a difference in students' lives.</p>
              
              <p>Best regards,<br>The SkillUp Team</p>
            </div>
            <div class="footer">
              <p>This is an automated notification from SkillUp.</p>
              <p>&copy; 2024 SkillUp Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Instructor email sent:', info.messageId);

        // Log preview URL for development (Ethereal)
        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error('❌ Error sending instructor email:', error);
        // Don't throw error - payment should succeed even if email fails
        return null;
    }
};

module.exports = {
    sendStudentPaymentConfirmation,
    sendInstructorPaymentNotification
};
