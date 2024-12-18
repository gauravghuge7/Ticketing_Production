

import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "akashdaud26@gmail.com",
        pass: "suhbqruuuspkxmok",
    },
});







export const sendEmail = async (email, subject, html) => {
    
    try {
        
        // send mail with defined transport object
        await transporter.sendMail({
            from: "akashdaud2612@gmail.com",
            to: email,
            subject: subject,
            html: html,
        });
    } catch (error) {
        console.log(error)
    }
};





export const ticketForwardTemplate = (email, ticketId, projectName, teamName) => {

    const html = `
        <h1>Hi ${email},</h1>
        <p>You have been assigned to a new task by ${teamName} team.</p>
        <p>Please click on the link below to view the task details.</p>
        
        <p>Thanks,<br>
        ${teamName} Team</p>
    `;
    return html;
}