import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';

import { Col, Container, Row, Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import { message } from 'react-message-popup';

const TaskList = ({ setConditionalComponent }) => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [team, setTeam] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    ticketName: '',
    projectName: '',
    ticketID: '',
    dueDate: '',
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [sendTask, setSendTask] = useState({ taskId: null, employeeId: null });
  const forwardTicketRef = useRef(null);
  const [reload, setReload] = useState(1);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/employee/getEmployeeAllTasks');
      if (response.data.success) {
        message.success(response.data.message);
        setTasks(response.data.data);
     
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const openForwardTicketDialog = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    setCurrentTask(task);
    setSendTask({ taskId: taskId, employeeId: null });
    if (forwardTicketRef.current) {
      forwardTicketRef.current.showModal();
      

    }
  };

  const closeForwardTicketDialog = () => {
    if (forwardTicketRef.current) {
      forwardTicketRef.current.close();
      
    }
    setCurrentTask(null);
  };

  const handleForwardTicket = async () => {
    try {

      const body = {
        employeeId: sendTask.employeeId,
        taskId: sendTask.taskId,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      

      const response = await axios.post('/api/employee/forwardTicketsAndTasksToAnotherEmployee', body, config)
      
      
      console.log("response.data => ", response.data);
     
      

    } 
    catch (error) {
      console.log(error);  
    }
  }

  const tasksPerPage = 10;
  const filteredTasks = tasks.filter((task) => {
    return (
      (searchFilters.ticketName === '' || task.taskName?.toLowerCase().includes(searchFilters.ticketName.toLowerCase())) &&
      (searchFilters.projectName === '' || task.companyName?.toLowerCase().includes(searchFilters.projectName.toLowerCase())) &&
      (searchFilters.ticketID === '' || task.ticket?.ticketId?.includes(searchFilters.ticketID)) &&
      (searchFilters.dueDate === '' || new Date(task.dueDate).toLocaleDateString() === searchFilters.dueDate)
    );
  });

  const displayedTasks = filteredTasks.slice(
    currentPage * tasksPerPage,
    (currentPage + 1) * tasksPerPage
  );

  useEffect(() => {
    fetchTasks();
  }, [reload]);

  const handleStatusChange = async (value, _id) => {
    try {
      const body = { status: value };
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      };
      const response = await axios.put(`/api/employee/changeStatus/${_id}`, body, config);
      if (response.data.success) {
        setReload(reload + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container
      style={{
        background: '#f0f4f8',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        color: '#333',
        maxWidth: '82%',
        marginLeft: '10px',
        overflowX: 'auto',  // Enables horizontal scrolling
        // whiteSpace: 'nowrap' // Prevents wrapping and keeps content in a single line
        

      }}
    >
      <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold',  textAlign: 'center' }}>Ticket List</h2>

      <Row className="mb-4">
        <Col md={3}>
          <FormControl
            placeholder="Filter by Ticket Name"
            value={searchFilters.ticketName}
            onChange={(e) => setSearchFilters({ ...searchFilters, ticketName: e.target.value })}
          />
        </Col>
        <Col md={3}>
          <FormControl
            placeholder="Filter by Project Name"
            value={searchFilters.projectName}
            onChange={(e) => setSearchFilters({ ...searchFilters, projectName: e.target.value })}
          />
        </Col>
        <Col md={3}>
          <FormControl
            placeholder="Filter by Ticket ID"
            value={searchFilters.ticketID}
            onChange={(e) => setSearchFilters({ ...searchFilters, ticketID: e.target.value })}
          />
        </Col>
        <Col md={3}>
          <FormControl
            type="date"
            value={searchFilters.dueDate}
            onChange={(e) => setSearchFilters({ ...searchFilters, dueDate: e.target.value })}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col md={12}>
          <Table style={{ overflowX: 'auto' }} >
            <thead>
              <tr>
                <th>#</th>
                <th>Ticket Type</th>
                <th>Ticket ID</th>
                <th>Ticket Name</th>
                <th>Priority</th>
                <th>SAP Type</th>
                <th>Due Date</th>
                <th>Assigned To Team</th>
                <th>Assigned By Name</th>
                <th>Assigned By Email</th>
                <th>Task Detail</th>
                <th>Document</th>
                <th>Status</th>
                <th>Task Forward</th>
                
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map((task, index) => (
                <tr key={index}>
                  <td>{index + 1 + currentPage * tasksPerPage}</td>
                  <td>{task.ticket ? 'Client Ticket' : 'Team Lead Task'}</td>
                  <td>{task.ticket?.ticketId || '-'}</td>
                  <td>{task.taskName || task.ticket?.ticketName}</td>
                  <td>{task.priority || task.ticket?.priority}</td>
                  <td>{task.saptype || task.ticket?.saptype}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>{task.assignedTo || task.ticket?.assignedTo}</td>
                  <td>{task.assignedByName || task.ticket?.assignedByName}</td>
                  <td>{task.assignedByEmail || task.ticket?.assignedByEmail}</td>
                  <td>{task.description || task.ticket?.ticketDescription}</td>
                  <td>
                    <a href={task.taskDocument || task.ticket?.ticketDocument} target="_blank" rel="noreferrer">
                      <Button variant="link">
                      <i className="bi bi-eye-fill" style={{ fontSize: "16px", color: "#007BFF" }}></i>
                      </Button>
                    </a>
                  </td>
                 
                  <td>
                    <select
                      onChange={(e) => handleStatusChange(e.target.value, task._id)}
                      value={task.status}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td>
                  <Button style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      color: "#007BFF",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease",
                    }}
                      variant="primary"
                      onClick={() => openForwardTicketDialog(task)}

                    >
                      Forward 
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <main>
        <section className="d-flex justify-content-center align-items-center">
        
          <dialog
          ref={forwardTicketRef}
          className="p-6 rounded-lg shadow-lg bg-white"
          style={{
            width: '300px',
            border: '1px solid #ccc',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <h2 className="text-xl font-bold mb-4">Forward Ticket</h2>
          <h2 className="text-xl mb-4">{currentTask?.taskName}</h2>
          <form
            onSubmit={() => handleForwardTicket()}
          >
            <div className="mb-4">
              <label htmlFor="employee" className="block mb-2">Select Employee</label>
              <select
                name="employee"
                id="employee"
                value={sendTask.employeeId}
                onChange={(e) => setSendTask({...sendTask, employeeId: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">Select employee</option>
                {team.employeeDetails &&
                  team.employeeDetails.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.employeeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Forward
              </button>
              <button
                type="button"
                onClick={closeForwardTicketDialog}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
          </dialog>
        </section>
      </main>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={(currentPage + 1) * tasksPerPage >= filteredTasks.length}
            >
              Next
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;
