

const teamLead_to_employee_emailTemplates = (email, ticketId, projectName) => {

   /** 
    *  Simple email template
   */

   const html = `
      <h1>Hi ${email},</h1>
      <p>You have been assigned to a new task by ${projectName} team.</p>
      <p>Please click on the link below to view the task details.</p>
      <p> ${ticketId}</p>
      <p>Thanks,<br>
      ${teamName} Team</p>
   `;
   return html;

}