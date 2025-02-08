import 'bootstrap/dist/css/bootstrap.min.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import { Button } from 'react-bootstrap';

import AssignTask from './AssignTask';
import { useNavigate, useParams } from 'react-router-dom';

const ProjectSection = () => {

  const [projects, setProjects] = useState({
    projectName: "Project Name",
    clientName: "Client Name",
    description: "Description",
    spokePersonName: "Spoke Person Name",
    spokePersonNumber: 1234567890,
    spokePersonEmail: "Spoke Person Email",
    projectId: "Project Id",
    _id: "",
  });

  const [team, setTeam] = useState({
    teamId: "Team Id",
    teamName: "Team Name",
    teamLead: "Team Lead",
    createdAt: "",
    _id: ""
  });

  const [employeeDetails, setEmployeeDetails] = useState([{
    employeeName: "Employee Name",
    employeeEmail: "Employee Email",
    designation: "Designation",
    _id: "Employee Id",
  }]);


  const [tickets, setTickets] = useState([{
    ticketName: "Ticket Name",
    ticketId: "Ticket Id",
    ticketDescription: "Ticket Description",
    priority: "Priority",
    status: "Status",
    assignedTo: "Assigned To",
    assignedByEmail: "Assigned By Email",
    assignedByName: "Assigned By Name",
    _id: "",
    ticketDocument: "",
    dueDate: "",

  }]);


  const [tasks, setTasks] = useState([{

    taskName: "Task Name",
    taskId: "Task Id",
    taskDescription: "Task Description",
    priority: "Priority",
    taskDocument: "",
    status: "Status",
    assignedTo: "Assigned To",
    assignedByEmail: "Assigned By Email",
    assignedByName: "Assigned By Name",

  }]);

  const [assignTask, setAssignTask] = useState(false);
  const assignRef = useRef();

  const [employeeTask, setEmployeeTask] = useState(false);
  const employeeTaskRef = useRef();

  const [currentTicketPage, setCurrentTicketPage] = useState(1);
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const itemsPerPage = 10;

  const projectId = useParams().projectId;

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    saptype: '',
    startDate: '',
    endDate: '',
    ticketId: '',
    ticketName: ''
  });

  const fetchProjects = async () => {
    console.log("projectId => ", projectId);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    };

    try {
      const response = await axios.get(`/api/employee/fetchProjectById/${projectId}`, config);

      console.log("response.data => ", response.data);

      // response.data.data[0].ticket

      console.log("response.data.data[0].ticket => ", response.data.data[0].ticket);
      console.log("employee => ", response?.data?.data[0]?.team[0].employeeDetails);

      if (response.data.success === true) {

        setProjects(response?.data?.data[0]);
        setTeam(response?.data?.data[0]?.team[0]);
        setEmployeeDetails(response?.data?.data[0]?.team[0].employeeDetails);
        setTickets(response?.data?.data[0]?.ticket);


      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);


  // fetch all tasks 
  const fetchTasks = async () => {

    try {

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      };

      const response = await axios.get(`/api/employee/getAllTasks/${projectId}`, config);

      console.log("response.data => ", response.data);

      if (response.data.success === true) {
        setTasks(response?.data?.data);
      }
      

    } 
    catch (error) {
      console.log(error);
      
    }
  }




  const fetchEmployeeTasks = async () => {
    
  }

  /**    for assign task to employee we getting the employee id from the employee list */
  const [currentEmployee, setCurrentEmployee] = useState("");


  const assignTaskToEmployee = async (employee) => {

    console.log("employee => ", employee);
    setCurrentEmployee(employee);
    setAssignTask(true);
  }

  const indexOfLastTicket = currentTicketPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const indexOfLastEmployee = currentEmployeePage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employeeDetails.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const indexOfLastTask = currentTaskPage * itemsPerPage;
  const indexOfFirstTask = indexOfLastTask - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    return (!filters.status || ticket.status === filters.status) &&
           (!filters.priority || ticket.priority === filters.priority) &&
           (!filters.saptype || ticket.saptype === filters.saptype) &&
           (!filters.startDate || ticketDate >= startDate) &&
           (!filters.endDate || ticketDate <= endDate) &&
           (!filters.ticketId || ticket.ticketId.includes(filters.ticketId)) &&
           (!filters.ticketName || ticket.ticketName.toLowerCase().includes(filters.ticketName.toLowerCase()));
  });

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    return (!filters.status || task.status === filters.status) &&
           (!filters.priority || task.priority === filters.priority) &&
           (!filters.saptype || task.saptype === filters.saptype) &&
           (!filters.startDate || taskDate >= startDate) &&
           (!filters.endDate || taskDate <= endDate) &&
           (!filters.ticketId || (task.ticket && task.ticket.ticketId.includes(filters.ticketId))) &&
           (!filters.ticketName || (task.ticket && task.ticket.ticketName.toLowerCase().includes(filters.ticketName.toLowerCase())));
  });

  const navigate = useNavigate();

  return (

    <div className="container mt-4"
    style={{
      backgroundColor: '#f9fafc',
      padding: '55px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      
    
    }}>

      {/**  back Button  */}
      <button 
        className="btn btn-primary mb-3" 
        onClick={() => navigate("/employee/teamlead")}
      >
        Back
      </button>

      
      <details
        className="card mb-3"
        style={{
          background: "#f0f4f8",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          color: "#333",
        }}
      >
        <summary style={{ padding: "15px", cursor: "pointer", fontSize: "18px" }}> Client Ticket </summary>
        <div className="card-body">
          {/* <legend style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}> Client Ticket </legend> */}
          <div className="row mb-3">
          <div className="row mb-3">
            <div className="col-md-2">
              <input 
                type="text"
                className="form-control"
                placeholder="Ticket ID"
                value={filters.ticketId}
                onChange={(e) => setFilters({...filters, ticketId: e.target.value})}
              />
            </div>
            <div className="col-md-2">
              <input 
                type="text"
                className="form-control"
                placeholder="Ticket Name"
                value={filters.ticketName}
                onChange={(e) => setFilters({...filters, ticketName: e.target.value})}
              />
            </div>
            <div className="col-md-2">
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {/* <div className="col-md-2">
              <select 
                className="form-select"
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
              >
                <option value="">Filter by Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div> */}
            <div className="col-md-2">
              <select 
                className="form-select"
                value={filters.saptype}
                onChange={(e) => setFilters({...filters, saptype: e.target.value})}
              >
                <option value="">SAP Module</option>
                <option value="ABAP">ABAP</option>
                <option value="Basis">Basis</option>
                <option value="FICO">FICO</option>
                <option value="MM">MM</option>
                <option value="PP">PP</option>
                <option value="SD">SD</option>
              </select>
            </div>
        
          
            <div className="col-md-2">
              <input 
                type="date"
                className="form-control"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            {/* <div className="col-md-2">
              <input 
                type="date"
                className="form-control"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div> */}
          </div>
         
          </div>
          <div className="table-responsive">
            <table
              className="table table-bordered table-hover"
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <thead
                className="thead-dark"
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                }}
              >
                <tr>
                  <th>#</th>
                  <th>Ticket ID</th>
                  <th>Ticket Name</th>
                  
                  <th>Priority</th>
                  <th>SAP Type</th>
                  <th>Creation Date</th>
             
                  <th>Spokesperson Email</th>
                  <th>Spokesperson Name</th>
                  <th>Spokesperson Number</th>
                  <th>Status</th>
             
                  <th>Description</th>
                  <th>Document</th>
                </tr>
              </thead>
              {filteredTickets.length > 0 ? (
                <>
                  <tbody>
                    {currentTickets.map((ticket, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ticket.ticketId}</td>

                        <td>{ticket?.ticketName}</td>
                       
                        <td>{ticket.priority}</td>
                        <td>{ticket.saptype}</td>
                          
                        <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 
                            ticket.ticketCreatedAt ? new Date(ticket.ticketCreatedAt).toLocaleDateString() : ''}</td>
                
                        
                        
                        <td>{ticket.assignedByEmail}</td>
                        <td>{ticket.assignedByName}</td>
                        <td>{ticket.assignedTo }</td>
                        <td>{ticket.status}</td>
                       
                        <td>{ticket?.ticketDescription}</td>
                        <td>
                          <a href={ticket ? ticket?.ticketDocument : ""} target="_blank" rel="noreferrer">
                            <button
                              className="btn btn-primary"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                color: "#007BFF",
                                fontWeight: "bold",
                                
                              }}
                              
                            >
                              <i className='bi bi-eye-fill'></i>
                            </button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 
                </>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="12" className="text-center">No tickets found.</td>
                  </tr>
                </tbody>
              )}
            </table>



            
          </div>
          <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentTicketPage(prev => prev - 1)}
                      disabled={currentTicketPage === 1}
                    >
                      <i className="bi bi-arrow-left"></i>
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => setCurrentTicketPage(prev => prev + 1)}
                      disabled={indexOfLastTicket >= tickets.length}
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
        </div>
      </details>


      {/**** Employee Details */}
      <details  className="card mb-3"
        style={{
          background: "#f0f4f8",
          borderRadius: "12px",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
          color: "#333",
    
        }}>
        <summary style={{ padding: "15px", cursor: "pointer", fontSize: "18px" }}> Employee Details </summary>
        <div className="card-body" >
          {/* <legend style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Employee Details</legend> */}
        
          <div className="row" style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                overflow: "hidden",
                padding: "20px",
              }}>
            {currentEmployees.map((employee, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card">
                  <div className="card-body">
                    
                    <h5 className="card-title" style={{fontWeight: "bold"}}>{employee.employeeName}</h5>
                    <p className="card-text"><strong>Email:</strong> {employee.employeeEmail}</p>
                    <p className="card-text"><strong>Designation:</strong> {employee.designation}</p>
                    <div className="row mb-3">
            <div className="col-md-12">
             
            </div>
            <div className="col-md-12 text-end">
              <button 
                className="btn btn-success"
                onClick={() => assignTaskToEmployee(employee._id)}
              >
                Add Tickets
              
              </button>
            </div>
          </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setCurrentEmployeePage(prev => prev - 1)}
              disabled={currentEmployeePage === 1}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setCurrentEmployeePage(prev => prev + 1)}
              disabled={indexOfLastEmployee >= employeeDetails.length}
            >
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </details>

      

      { /**  Task List of Employees */}
    <details
      className="card mb-3"
      onClick={() => fetchTasks()}
      style={{
        background: "#f0f4f8",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        color: "#333",
      }}
    >
    {/* <legend style={{ margin: "20px", fontSize: "24px", fontWeight: "bold" }}> Employees Ticket </legend> */}
      <summary
        style={{
          padding: "15px",
          cursor: "pointer",
          fontSize: "18px",
      
          borderBottom: "1px solid #ddd",
          // backgroundColor: "#007BFF",
          color: "#000",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        Tickets List
      </summary>
      

      <div className="card-body" style={{ padding: "20px" }}>

        <div className="row mb-2">
          
        <div className="col-md-2">
            <input 
              type="text"
              className="form-control"
              placeholder="Ticket ID"
              value={filters.ticketId}
              onChange={(e) => setFilters({...filters, ticketId: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <input 
              type="text"
              className="form-control"
              placeholder="Ticket Name"
              value={filters.ticketName}
              onChange={(e) => setFilters({...filters, ticketName: e.target.value})}
            />
          </div>
          <div className="col-md-2">
            <select 
              className="form-select"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value=""> Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="col-md-2">
            <select 
              className="form-select"
              value={filters.saptype}
              onChange={(e) => setFilters({...filters, saptype: e.target.value})}
            >
              <option value="">SAP Module</option>
              <option value="ABAP">ABAP</option>
              <option value="Basis">Basis</option>
              <option value="FICO">FICO</option>
              <option value="MM">MM</option>
              <option value="PP">PP</option>
              <option value="SD">SD</option>
            </select>
          </div>
       
          {/* <div className="col-md-2">
            <input 
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div> */}
          <div className="col-md-2">
            <input 
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
       
        </div>

        <div className="table-responsive">
          
          <table
          
            
            className="table table-bordered table-hover"
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <thead
              className="thead-dark"
              style={{
                backgroundColor: "#007BFF",
                color: "#fff",
              }}
            >
              <tr>
                <th>#</th>
                <th className="border px-4 py-2">Ticket Type</th>
                <th className="border px-4 py-2">Ticket ID</th>
                <th className="border px-4 py-2">Tickets Name</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">SAP Module</th>
                <th className="border px-4 py-2"> Creation Date</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Status</th>
             
                <th className="border px-4 py-2">	Spokesperson Email</th>
                <th className="border px-4 py-2">	Spokesperson Name</th>
                <th className="border px-4 py-2">	Spokesperson Number</th>
                
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Document</th>
              </tr>
            </thead>
            {filteredTasks.length > 0 ? (
              <>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{task.ticket ? "Client Ticket" : "Team Lead Task"}</td>
                      <td  className="border px-4 py-2">{ task.ticket ? task.ticket.ticketId : "-"}</td>

                      <td className="border px-4 py-2">{task.ticket ? task.ticket.ticketName : task.taskName}</td>
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.priority : task.priority}</td>
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.saptype : "-"}</td>
                      <td className="border px-4 py-2">{new Date(task.ticket ? task.ticket.createdAt : task.createdAt).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.status : task.status}</td>
                    
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.assignedByEmail : "-"}</td>
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.assignedByName : "-"}</td>
                        <td className="border px-4 py-2">{task.ticket ? task.ticket.assignedTo : "-"}</td>
                     
                      <td className="border px-4 py-2">{task.ticket ? task.ticket.ticketDescription : task.description}</td>
                      <td className="border px-4 py-2">
                        <a href={task?.taskDocument || task?.ticket?.ticketDocument } target="_blank" rel="noreferrer">
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              color: "#007BFF",
                              fontWeight: "bold",
                            }}>
                            <i className='bi bi-eye-fill'></i>
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
               
              </>
              
            ) : (
              <tbody>
                <tr>
                  <td colSpan="15" className="text-center">No tasks found.</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
         <div className="d-flex justify-content-between  mt-3">
                  <div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentTaskPage(prev => prev - 1)}
                    disabled={currentTaskPage === 1}
                  >
                    <i className="bi bi-arrow-left "></i>
                  </button></div>
                  <div><button
                    className="btn btn-primary"
                    onClick={() => setCurrentTaskPage(prev => prev + 1)}
                    disabled={indexOfLastTask >= filteredTasks.length}
                  >
                    <i className="bi bi-arrow-right"></i>
                  </button></div>
                </div>
      </div>
    </details>


            {/* Dialoing Box */}

      <main className=''>
        {
          assignTask && 
          <AssignTask 
            teamLead={team._id}
            currentEmployee={currentEmployee}
            projectId={projectId}
            tickets={tickets} 
            setAssignTask={setAssignTask} 
            assignRef={assignRef}
          />
        }
      
      </main>


      {/**  employee task dialog  */}
      <main className=''>
        {
          employeeTask && 
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50">
            {/* Large scrollable dialog */}
            <dialog
              open={employeeTaskRef}
              className="bg-white p-6 rounded-md shadow-lg max-w-6xl w-full max-h-screen h-auto overflow-y-auto z-50"
            >
              <button
                className="relative top-0 right-0 float-right bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => setEmployeeTask(false)}
              >
                Cancel
              </button>

              <div className="container mx-auto">
                <h2 className="text-center text-2xl font-semibold mb-4">Assign Task</h2>

                <div className="overflow-x-auto">
                  {/* Table Section */}
                  <table className="table-auto w-full">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Task Name</th>
                        
                        <th className="border px-4 py-2">Priority</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Assigned To</th>
                        <th className="border px-4 py-2">Assigned By Email</th>
                        <th className="border px-4 py-2">Assigned By Name</th>
                        <th className="border px-4 py-2">Task Description</th>
                        <th className="border px-4 py-2">Task Document</th>
                      </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task, index) => (
                      <tr key={index}>
                        <td>{task.ticket ? "Client Ticket" : "Team Lead Task"}</td>
                        <td>{task.ticket ? task.ticket.ticketId : "-"}</td>
                        <td>{task.ticket ? task.ticket.ticketName : task.taskName}</td>
                        <td>{task.ticket ? task.ticket.saptype : ""}</td>
                        <td>{task.ticket ? task.ticket.assignedByName : task.teamLead}</td>
                        <td>{task.priority ? task.priority : task.ticket.priority }</td>
                        <td>{task.status ? task.status : task.ticket.status}</td>
                        <td>{task.description ? task.description : task.ticket.description}</td>
                        <td>
                          <a href={task.ticket?.ticketDocument || task.taskDocument} target="_blank" rel="noreferrer">
                            <Button variant="primary">View</Button>
                          </a>
                        </td>
                        <td>
                          <Button variant="primary">Forward Ticket</Button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </dialog>
          </div>

  
        }
      
      </main>


    </div>
  );
};

export default ProjectSection;