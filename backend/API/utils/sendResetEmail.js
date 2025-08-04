import jwt from 'jsonwebtoken';
import transporter from '../onboarding/email.js';

const sendVerificationEmail = async (user) => {
    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET3, { expiresIn: '1h' });

    const verificationLink = `${process.env.CLIENT_URL}/resetpassword?token=${token}`;

    await transporter.sendMail({
        from: '"financeApp" <no-reply@financeAppcom>',
        to: user.email,
        subject: 'Email Verification',
        html: `<h2>Hello ${user.fullname},</h2>
                     <p>Please verify your email by clicking the link below:</p>
                     <a href="${verificationLink}">Verify Email</a>`
    });
};

export default sendVerificationEmail;
