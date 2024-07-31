"use server";
import nodemailer from 'nodemailer';
import * as handlebars from "handlebars";

export const sendEmail = async ({ subject, message, email, data }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: message,
    };

    try {
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log("Email Sent", info.response);
                    resolve(info.response);
                }
            });
        });
        return {
            message: "Email sent successfully",
        }
    } catch (error) {
        return {
            message: "Email not sent",
        }
    }




}