import {Schema, model} from 'mongoose';

const taskSchema = new Schema({

   project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
   },


   employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee"
   },

   previousEmployee: [{
      type: Schema.Types.ObjectId,
      ref: "Employee"
   }],


   taskId: {
      type: String,
   },

   description: {
      type: String,
      required: true,
   },


   taskDocument: {
      type: String,
   },

   teamLead: {
      type: Schema.Types.ObjectId,  
      ref: "Team"
   },

   taskName: {
      type: String,
   
   },

   status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"]
   },

   priority: {
      type: String,
      
   },


   assignBy: {
      type: Schema.Types.ObjectId,
      ref: "Team"
   },

   currentWork: {
      type: String,
   },

   ticket: {

      type: Schema.Types.ObjectId,
      ref: "Ticket",

   },
   
   dueDate: {
      type: Date,
      required: true
   },
   



});
{timestamps: true}
export const Task = model('Task', taskSchema);