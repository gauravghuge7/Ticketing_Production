

const teamLead_to_employee_emailTemplates = (email, ticketId, projectName, TeamLeadName) => {

   /** 
    *  Simple email template
   */

   const html = `
      <h4>Hi ${email},</h4>
      <p>You have been assigned to a new task by ${projectName} team.</p>
      
      <p>Please click on the link below to view the task details.</p>
      <p> ${ticketId}</p>
      <p>Thanks,<br>
      <p>${TeamLeadName}</p>
   `;
   return html;

}



export {
   teamLead_to_employee_emailTemplates
}