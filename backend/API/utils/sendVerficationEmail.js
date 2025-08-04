import jwt from 'jsonwebtoken';
import transporter from '../onboarding/email.js';

const sendVerificationEmail = async (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET2, { expiresIn: '1h' });

    const verificationLink = `${process.env.CLIENT_URL}/login-steps/email-verified?token=${token}`;

    await transporter.sendMail({
        from: '"financeApp" <no-reply@financeApp.com>',
        to: user.email,
        subject: 'Email Verification',
        html: `<h2>Hello ${user.fullname},</h2>
                     <p>Please verify your email by clicking the link below:</p>
                     <a href="${verificationLink}">Verify Email</a>`
    });
};

export default sendVerificationEmail;
