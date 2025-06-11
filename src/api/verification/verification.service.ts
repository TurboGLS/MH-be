import { UserModel } from "../user/user.model";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function verifyEmailToken(token: string) {
    console.log('Verifying token:', token);
    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
        console.log('Found user:', user);
        return null;
    }

    // Controllo qui la scadenza del token
    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
        console.log('Token expired or no expiration date:', user.verificationTokenExpires);
        return null;
    }

    user.active = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();
    return user;
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendVerificationEmail(to: string, url: string) {
    await transporter.sendMail({
        from: `"MH-Support" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verifica la tua email',
        html: `
            <p>Grazie per la registrazione! Clicca qui per attivare il tuo account:</p>
            <p><a href="${url}">${url}</a></p>
        `
    });
}