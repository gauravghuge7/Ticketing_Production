import { Task } from "../../model/Task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../../helper/cloudinary.js"
import mongoose from "mongoose";
import { Employee } from "../../model/employee.model.js";
import { sendEmail } from "../../helper/sendEmail.js";
import { Project } from "../../model/project.model.js";
import { teamLead_to_employee_emailTemplates } from "../../helper/email.templates.js";
import { Ticket } from "../../model/ticket.project.model.js";



    // assign Tasks To TeamMembers
const assignTasksToTeamMembers = asyncHandler(async (req, res) => {

      try {

            const {
                  project,
                  employee,
                  description,
                  assignBy,
                  tickets, 
                  taskName,
                  priority,
                  dueDate

            } = req.body;


            console.log("req.body => ", req.body);

            if(!project || !employee || !description || !dueDate ) {
                  throw new ApiError(400, "Please provide all the required fields");
            }

            // create a entry in Task Schema

            let response;



            if(req.file) {

                  response = await uploadOnCloudinary(req.file.path);
            }
            
            let notTicket = "for ticket verification";

            if(tickets === "ownWork") {
                  notTicket = null
            }
            

            const task = await Task.create({

                  project,
                  employee,
                  description,
                  assignBy,
                  dueDate,
                  taskDocument: response?.url,
                  taskName,
                  priority,
                  status: "Started",
                  currentWork: "Assigned task to employee",


            })

            if(notTicket) {
                  task.ticket = tickets;

                  await task.save({validateBeforeSave: false});
            }


            //   algorithm 
            /** 
             *  1)  find the email and send to the email
             * 2)  create the template 
             *  3)  send the template
             * 
            */

            const ticket = await Ticket.findById(task.ticket).then(ticket => ticket.ticketId)

            const teamLead = await Employee.findById(req.user._id);

            const employeeEmail = await Employee.findById(employee)
            const projectName = await Project.findById(project).then(project => project.projectName)
            const html = teamLead_to_employee_emailTemplates(employeeEmail.employeeName, ticket, projectName, teamLead.employeeName)
            const subject = "New Task Created"

            sendEmail(employeeEmail.employeeEmail, subject, html);


            return res
                  .status(200)
                  .json(
                        new ApiResponse(200, "Task created successfully", task)
                  )
      } 
      catch (error) {
            
            console.log(" Error => ", error.message)
            throw new ApiError(400, error.message);
      }

})


const getTeamTasks = asyncHandler(async (req, res) => {
      
      try {

            const { employee } = req.params;

            if(!employee) {
                  throw new ApiError(400, "Please provide the team lead email");
            }

            const tasks = await Task.find({employee: employee})
                  .populate("project")
                  .populate("employee")
                  .populate("teamLead")
                  .populate("ticket")
                  .populate("assignBy")
                  .sort({createdAt: "desc"})
                  .limit(10)

            return res
                  .status(200)
                  .json(
                        new ApiResponse(200, "Team Tasks fetched successfully", tasks)
                  )
      } 
      catch (error) {
            
            console.log(" Error => ", error.message)
            throw new ApiError(400, error.message);
      }

})



const getAllTasks = asyncHandler (async (req, res) => {

      try {

            const { projectId } = req.params;


            const tasks = await Task.aggregate([

                  {
                        $match: {
                              project: new mongoose.Types.ObjectId(projectId)
                        }
                  },

                  {
                        $lookup: {
                              from: "tickets",
                              localField: "ticket",
                              foreignField: "_id",
                              as: "ticket"
                        }
                  },
                  {
                        $addFields: {
                              ticket: { $arrayElemAt: ["$ticket", 0]}
                        }
                  },


                  {
                        $project: {

                              _id: 1,
                              description: 1,
                              taskDocument: 1,
                              taskName: 1,
                              assignBy: 1,
                              dueDate: 1,

                              status: 1,
                              priority: 1,

                              currentWork: 1,
                              

                              ticket: 1,
                              teamLead: 1,

                        }
                  }


            ])


            return res
                  .status(200)
                  .json(
                        new ApiResponse(200, "Task fetched successfully", tasks)
                  )

      } 
      catch (error) {
            
            console.log(" Error => ", error.message)
            throw new ApiError(400, error.message);
      }

})





export {
      assignTasksToTeamMembers,
      getTeamTasks,
      getAllTasks,

}