import mongoose, { mongo } from "mongoose";
import { Client } from "../../model/client.model.js";
import { Project } from "../../model/project.model.js";
import { Ticket } from "../../model/ticket.project.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../../helper/cloudinary.js";
import { generateTicketId } from "../../helper/generateTicketId.js";
import { sendEmail, ticketForwardTemplate } from "../../helper/sendEmail.js";
import { Team } from "../../model/team.model.js";
import { Employee } from "../../model/employee.model.js";


const fetchTasks = asyncHandler (async (req,res) => {
    
   try {

       const { projectId } = req.params;

       const tickets = await Ticket.aggregate([
           {
               $match: {
                   project: new mongoose.Types.ObjectId(projectId)
               }
           }

       ])


       return res
           .status(200)
           .json(
               new ApiResponse(200, "tickets fetched successfully", tickets)
           )
       
       
   } 
   catch (error) {
   
       console.log(" Error => ", error.message)
       throw new ApiError(400, error.message);
   }

})



const createTicket = asyncHandler(async (req, res) => {

    try {
        
        const { 
            assignedTo, 
            assignedByEmail, 
            assignedByName, 


            priority,
            project,

            ticketId,
            description,  
            ticketName,
            saptype,
            dueDate
        
        } = req.body;

        console.log("req.body", req.body);

        console.log("req.file", req.file);


        if(!assignedTo || !assignedByEmail || !assignedByName || !priority || !project || !ticketId || !description) {
            throw new ApiError(400, "Please provide all the required fields");
        }

        // find the entry in the database
        const client = await Client.findOne({ clientEmail: req.user.clientEmail })
        
        if(!client) {
            throw new ApiError(400, "Client does not exist");
        }

        const ticketIdDemo = await generateTicketId(req?.user?.clientEmail);

        const response = await uploadOnCloudinary(req.file.path);

        const projectName = await Project.findById(project ).then(project => project.projectName)

        // create a entry in the database
        const ticket = await Ticket.create({

            assignedTo,
            assignedByEmail,
            assignedByName,
            priority,
            project,
            ticketId : ticketIdDemo,
            ticketDescription: description,
            ticketName,
            ticketDocument: response?.url,
            saptype,
            dueDate,
            status: "Open",


        })

        const teamDetail = await Project.aggregate([
    
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(project)
                }
            },

            {
                $lookup: {
                    from: "teams",
                    localField: "team",
                    foreignField: "_id",
                    as: "team",

                }
            },
            {
                $addFields: {
                    teamLead: "$team.teamLead",
                    teamName: "$team.teamName"
                }
            },

            {
                $project: {
                    
                    projectName: 1,
                    teamLead: 1,
                    teamName: 1
                
                }
            }

        ])

        console.log("teamDetail => ", teamDetail)

        const teamLead = teamDetail[0].teamLead;
        const teamName = teamDetail[0].teamName[0];


        const employee = await Employee.findById(teamLead);


    
        const html = await ticketForwardTemplate(employee.employeeEmail, ticket.ticketId, projectName, teamName, client.clientName, client.clientEmail)

        console.log("HTML => ", html)

        const subject = `New Ticket from ${projectName} project`

        const sendMail = await sendEmail(employee.employeeEmail, subject, html);



        return res
        .status(200)
            .json(
                new ApiResponse(200, "Ticket created successfully", ticket)
            )

    } 
    catch (e) {
        console.error('Error', e)
        throw new ApiError(400, e.message)
    }
    
})


const editTicket = asyncHandler(async (req, res) => {
    
    try {
        
        const { ticketId } = req.params;
        
        const { 
            assignedTo, 
            assignedByEmail, 
            assignedByName, 

            priority,
            project,
            description,  
            ticketName,
            saptype,
            dueDate
        } = req.body;
        
        console.log("req.body", req.body);
        
        console.log("req.file", req.file);
        
        
        if(!assignedTo || !assignedByEmail || !assignedByName || !priority || !project || !ticketId || !description) {
            throw new ApiError(400, "Please provide all the required fields");
        }
        
        // find the entry in the database
        const client = await Client.findOne({ clientEmail: req.user.clientEmail })
        
        if(!client) {
            throw new ApiError(400, "Client does not exist");
        }
        
        
        
        
        const response = await uploadOnCloudinary(req.file.path);
        
        
        // create a entry in the database
        const ticket = await Ticket.findByIdAndUpdate(ticketId, {
            
            assignedTo,
            assignedByEmail,
            assignedByName,
            priority,
            project,
            ticketId,
            ticketDescription: description,
            ticketName,
            ticketDocument: response?.url,
            saptype,
            dueDate,
            status: "Open",
            
            
        })
        
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Ticket created successfully", ticket)
            )
        
    } 
    catch (e) {
        console.error('Error', e)
        throw new ApiError(400, e.message)
    }
    
})


const fetchTicketByClient = asyncHandler(async (req, res) => {

    try {

        const tickets = await Project.aggregate([
            {
                $match: {
                    client: new mongoose.Types.ObjectId(req?.user?._id)
                }
            },
            {
                $lookup: {
                    from: "tickets",
                    localField: "_id",
                    foreignField: "project",
                    as: "tickets",

                
                }
            },

            {
                $addFields: {
                    tickets: "$tickets"
                }
            },
            {
                $project: {
                    tickets: 1,
                }
            }


        ])


        const arraySome = [];

        const ticket = tickets.map(ticket => {
            arraySome.push(ticket.tickets)
        })

        console.log("ticket => ", arraySome.length);

        const temp = arraySome.flat();

        return res 
            .status(200)
            .json(
                new ApiResponse(
                    200, 
                    "tickets fetched successfully", 
                    {
                        tickets : temp
                    }
                )
            )
        
    } 
    catch (error) {
        console.log("Error => ", error)    
    }
    finally {
        console.log("function execution successfully");
    }
})



const fetchAllClientTickets = asyncHandler(async (req, res) => {

    try {
        
        const _id = req?.user?._id;


        const tickets = await Project.aggregate([

            /**  Matching All Projects where client exists */
            {
                $match: {
                    client: new mongoose.Types.ObjectId(_id)
                }
            },

            /**  Fetching Tickets for each project and add projectName field into the tickets  */
            {
                $lookup: {
                    from: "tickets",
                    foreignField: "project",
                    localField: "_id",
                    as: "tickets",
                    pipeline: [
                        {
                            $addFields: {
                                projectName: "$$ROOT.projectName"
                            }
                        }
                    ]
                }
            },
            /*** Unwind tickets array  */
            {
                $unwind: "$tickets"
            },
            /***  add projectName field into the tickets Object */
            {
                $addFields: {
                    "tickets.projectName": "$projectName"
                }
            },
            /*** Unwind tickets array  */
            {
                $unwind: "$tickets"
            },
            {
                $unwind: "$tickets"
            },
            {
                $unwind: "$tickets"
            },

            /** Overall Tickets Projection and  data here is the tickets array  */
            {
                $project: {
                    tickets: {
                        projectName: 1,
                        ticketId: 1,
                        priority: 1,
                        status: 1,
                        dueDate: 1,
                        assignedTo: 1,
                        assignedByEmail: 1,
                        assignedByName: 1,
                        ticketName: 1,
                        saptype: 1,
                        ticketDescription: 1,
                        ticketDocument: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        ticketId: 1,
                    }
                    
                }
            }
        ])

        console.log("tickets", tickets);
        

        return res 
            .status(200)
            .json(
                new ApiResponse(
                    200, 
                    "tickets fetched successfully", 
                    {
                        totalTickets : tickets
                    }
                )
            )
        
    } 
    catch (error) {
        
    }
})

export {
    createTicket,
    fetchTasks,
    fetchTicketByClient,
    fetchAllClientTickets
}


