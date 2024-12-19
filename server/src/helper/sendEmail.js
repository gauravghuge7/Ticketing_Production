

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





export const ticketForwardTemplate = (email, ticketId, projectName, teamName, clientName, clientEmail) => {

    const html = `
        <p>Hi ${teamName},</p>
        <p>You have been assigned to a new ticket from ${projectName} .</p>
        <p>Please click on the Ticket below to view the Ticket details.</p>
        
     
        <a href="https://gbis.team/task-management/task/${ticketId}">${ticketId}</a>
        <p>Thanks,<br>
        <p>${clientName}</p> <br>
           <p>${clientEmail}</p>
        </p>
    `;
    return html;
} 