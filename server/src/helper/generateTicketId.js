

/**

generate the ticket id for the project 
*/


const generateTicketId = async (email) => {

   try {
      const stringData = email.substring(0, email.indexOf("@"));
      const number = Math.floor(Math.random() * 10000);
      const ticketId = stringData + number;


      console.log("ticketId generated => ", ticketId)
      
      return ticketId;
   } 
   catch (error) {
      console.log(error)
      throw new ApiError(500, error.message)
   }
}

export {
   generateTicketId
}
