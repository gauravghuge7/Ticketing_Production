import bcrypt
  from 'bcrypt';                 // this is the password bcrypt library for hashung the password
import jwt
  from 'jsonwebtoken';   //using the jwt token for the access and refresh token
import mongoose from 'mongoose';

import { uploadOnCloudinary } from '../../helper/cloudinary.js';
import { Admin } from '../../model/admin.model.js';
import { Client } from '../../model/client.model.js';
import { Employee } from '../../model/employee.model.js';
import { Project } from '../../model/project.model.js';
import { Team } from '../../model/team.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';


const editClient = asyncHandler(async(req, res) => {


    try {

        console.log("req.params => ", req.params);
        console.log ("req.query => ", req.query);
        console.log("req.param.clientId => ", req.params.clientId);

        const { _id } = req.params;

        const {clientName, clientEmail } = req.body;

        if(!_id) {
            throw new ApiError(400, "Please provide all the required fields");
        }

        // check if the client already exists
        
        const existedClient = await Client.findOne({ _id })
        
        if(!existedClient) {
            throw new ApiError(400, "Client does not exist");
        }

        // update the entry in the database 
        
        const client = await Client.findByIdAndUpdate(_id, {
            clientName,
            clientEmail,
        
        })
        
        return res.status(200).json(                                           // 
            new ApiResponse(200, "Client updated successfully", client)
        )
    
    }
    catch (error) {
        console.log(" Error => ", error.message)
        throw new ApiError(400, error.message);    
    }

} )

const deleteClient = asyncHandler(async(req, res) => {

    try {

        console.log("req.query => ", req.query);
        console.log("req.params => ", req.params);

        const {_id} = req.params;

        if(!_id) {
            throw new ApiError(400, "Please provide the client id");
        }

        // find the entry in the database
        
        const client = await Client.findById(_id);
        
        if(!client) {
            throw new ApiError(400, "Client does not exist");
        }
        
        // delete the entry in the database 
        
        await Client.findByIdAndDelete(_id);
        
        return res.status(200).json(                                           // 
            new ApiResponse(200, "Client deleted successfully", client)
        )
    
    }
    catch (error) {
        console.log(" Error => ", error.message)
        throw new ApiError(400, error.message);    
    }

} )

const deleteTask = asyncHandler(async(req, res) => {
    
    try {
        
            console.log("req.query => ", req.query);
            console.log("req.params => ", req.params);
            
            const {_id} = req.params;
            
            if(!_id) {
                throw new ApiError(400, "Please provide the task id");
            }
            
            // find the entry in the database
            
            const task = await Client.findById(_id);
            
            if(!task) {
                throw new ApiError(400, "Task does not exist");
            }
            
            // delete the entry in the database 
            
            await Client.findByIdAndDelete(_id);
            
            return res.status(200).json(                                           // 
                new ApiResponse(200, "Task deleted successfully", task)
            )


    }
    catch (error) {
        console.log(" Error => ", error.message)
        throw new ApiError(400, error.message);    
    }

} )


const editTask = asyncHandler(async(req, res) => {
    
    try {
        
            console.log("req.query => ", req.query);
            console.log("req.params => ", req.params);
            
            const {_id} = req.params;
            
            if(!_id) {
                throw new ApiError(400, "Please provide the task id");
            }
            
            // find the entry in the database
            
            const task = await Client.findById(_id);
            
            if(!task) {
                throw new ApiError(400, "Task does not exist");
            }
            
            // update the entry in the database 
            
            const updatedTask = await Client.findByIdAndUpdate(_id, {
                
                taskName: req.body.taskName,
                priority: req.body.priority,
                saptype: req.body.saptype,
                dueDate: req.body.dueDate,
                assignedTo: req.body.assignedTo,
                assignedByEmail: req.body.assignedByEmail,
                assignedByName: req.body.assignedByName,
                ticketName: req.body.ticketName,
                ticketId: req.body.ticketId,
                description: req.body.ticketDescription,
                ticketDocument: req.body.ticketDocument,
                saptype: req.body.saptype,
                dueDate: req.body.dueDate,
            
            })
            
            return res.status(200).json(                                           // 
                new ApiResponse(200, "Task updated successfully", updatedTask)
            )


    }
    catch (error) {
        console.log(" Error => ", error.message)
        throw new ApiError(400, error.message);    
    }
})      



export {
    editClient,
    deleteClient,
    editTask,
    deleteTask
};