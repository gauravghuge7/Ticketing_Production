import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Col, Container, Row, Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import { message } from 'react-message-popup';

const TaskList = ({ setConditionalComponent }) => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    ticketName: '',
    ticketID: '',
    dueDate: '',
    status: '',
    priority: '',
    assignedTo: '',
    ticketType: '', // New filter for Ticket Type
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

      const response = await axios.post(
        '/api/employee/forwardTicketsAndTasksToAnotherEmployee',
        body,
        config
      );
      console.log('response.data => ', response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const tasksPerPage = 10;

  const filteredTasks = tasks.filter((task) => {
    return (
      (searchFilters.ticketName === '' ||
        (task.taskName?.toLowerCase().includes(searchFilters.ticketName.toLowerCase()) ||
          task.ticket?.ticketName?.toLowerCase().includes(searchFilters.ticketName.toLowerCase()))) &&
      (searchFilters.ticketID === '' ||
        task.ticket?.ticketId?.toLowerCase().includes(searchFilters.ticketID.toLowerCase())) &&
      (searchFilters.dueDate === '' ||
        (task.dueDate &&
          new Date(task.dueDate).toLocaleDateString() === searchFilters.dueDate)) &&
      (searchFilters.status === '' ||
        task.status?.toLowerCase() === searchFilters.status.toLowerCase()) &&
      (searchFilters.priority === '' ||
        (task.priority?.toLowerCase() || task.ticket?.priority?.toLowerCase()) ===
          searchFilters.priority.toLowerCase()) &&
      (searchFilters.assignedTo === '' ||
        task.assignedTo?.toLowerCase().includes(searchFilters.assignedTo.toLowerCase())) &&
      (searchFilters.ticketType === '' ||
        (task.ticket
          ? 'Client Ticket'
          : 'Team Lead Task'
        )
          .toLowerCase()
          .includes(searchFilters.ticketType.toLowerCase()))
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
        borderRadius: '10px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        color: '#333',
      }}
    >
      <h2 style={{ marginBottom: '25px', color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
        Ticket List
      </h2>

      <Row className="mb-4">
        <Col md={2}>
          <FormControl
            placeholder="Ticket ID"
            value={searchFilters.ticketID}
            onChange={(e) => setSearchFilters({ ...searchFilters, ticketID: e.target.value })}
          />
        </Col>
        <Col md={2}>
          <FormControl
            placeholder="Ticket Name"
            value={searchFilters.ticketName}
            onChange={(e) => setSearchFilters({ ...searchFilters, ticketName: e.target.value })}
          />
        </Col>
        
        <Col md={2}>
          <FormControl
            as="select"
            value={searchFilters.status}
            onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
          >
            <option value="">Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </FormControl>
        </Col>
        
        <Col md={2}>
          <FormControl
            as="select"
            value={searchFilters.priority}
            onChange={(e) => setSearchFilters({ ...searchFilters, priority: e.target.value })}
          >
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </FormControl>
        </Col>

        <Col md={2}>
          <FormControl
            as="select"
            value={searchFilters.ticketType}
            onChange={(e) => setSearchFilters({ ...searchFilters, ticketType: e.target.value })}
          >
            <option value="">Ticket Type</option>
            <option value="Client Ticket">Client Ticket</option>
            <option value="Team Lead Task">Team Lead Task</option>
          </FormControl>
        </Col>

        <Col md={2}>
          <FormControl
            type="date"
            value={searchFilters.dueDate}
            onChange={(e) => setSearchFilters({ ...searchFilters, dueDate: e.target.value })}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center mt-5">
        <Col md={12} style={{ overflowX: 'auto' }}>
          <Table bordered striped hover responsive
            style={{
              backgroundColor: "#fff",
              color: "#333",
              borderRadius: "12px",
            }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Ticket Type</th>
                <th>Ticket ID</th>
                <th>Ticket Name</th>
                <th>Priority</th>
                <th>SAP Module</th>
                <th>Due Date</th>
                <th>Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Ticket Detail</th>
                <th>Document</th>
                <th>Status</th>
                <th>Ticket Forward</th>
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
                        <i className="bi bi-eye-fill" style={{ fontSize: '16px', color: '#007BFF' }}></i>
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
                 
                    <Button
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        color: '#007BFF',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease',
                      }}
                      variant="primary"
                      onClick={() => openForwardTicketDialog(task)}
                    >
                      Forward
                    </Button>
                 
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;
