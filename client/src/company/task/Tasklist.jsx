import {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
import {
  Col,
  Container,
  Row,
  Table,
  Form,
  Button, FormControl, InputGroup
} from 'react-bootstrap';

const TaskList = ({ setConditionalComponent, projectId }) => {
  const editRef = useRef(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    ticketName: "",
    assignedByName: "ABC Company", 
    priority: "High",
    saptype: "SAP ABAP",    
    status: "",
    ticketCreateDate: "2022-01-01",
    dueDate: "2022-01-01",
    assignName: "John Doe",
    assignedByEmail: "johndoe@gmail.com",
    assignTeam: "ABC Team",  
    ticketDocument: "https://example.com/ticketDocument.pdf"  
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const tasksPerPage = 10;

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/api/client/fetchAllClientTickets`);
      console.log("response", response);
      if (response.data.success) {
        setTasks(response?.data?.data?.tickets);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Export tasks to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tasks); // Convert JSON to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "TasksList.xlsx"); // Save file
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) // Include ticketId in search
  );

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (tasks && tasks.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-center">No Tickets found...</h2>
      </div>
    );
  }

  return (
    <Container
      style={{
        background: "#f0f4f8",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        color: "#333",
        maxWidth: "95%",
        marginTop: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Tickets List</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <InputGroup style={{ maxWidth: "60%" }}>
            <FormControl
              placeholder="Search Ticket Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text> */}
          </InputGroup>
          <Button variant="success" onClick={exportToExcel}>
            <i className="bi bi-file-earmark-spreadsheet-fill"></i> Export to Excel
          </Button>
        </div>
      </div>

      <Row className="justify-content-md-center mt-5">
        <Col md={12}>
          <Table
            striped
            bordered
            hover
            style={{
              backgroundColor: "#fff",
              color: "#333",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead
              style={{
                backgroundColor: "#343a40",
                color: "#fff",
                textAlign: "center",
                fontSize: "1.1rem",
              }}
            >
              <tr>
                <th>#</th>
                <th>Ticket ID</th>
                <th>Ticket Name</th>
                <th>Priority</th>
                <th>SAP Type</th>
                <th> Status</th>
                <th>Spokesperson Email</th>
                <th> Description</th>
                <th> Document</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td>{indexOfFirstTask + index + 1}</td>
                  <td>{task.ticketId}</td>
                  <td>{task.ticketName}</td>
                  <td>{task.priority}</td>
                  <td>{task.saptype}</td>
                  <td>{task.status}</td>
                  <td>{task.assignedByEmail}</td>
                  <td>{task.ticketDescription}</td>
                  <td>
                    <a href={task.ticketDocument} target="_blank" rel="noreferrer">
                      <Button variant="" style={{ color:"#007BFF" }}>
                        <i className="bi bi-eye-fill"></i>
                      </Button>
                    </a>
                  </td>
                  {/* <td>
                    <div className='d-flex'>
                      <Button variant="" style={{ color:"#007BFF" }} className="me-2" onClick={() => handleEdit(task)}>
                        <i className="bi bi-pencil-square"></i>
                      </Button>
                      <Button variant="" onClick={() => handleDelete(task)} style={{ color:"red" }}>
                        <i className="bi bi-trash-fill"></i>
                      </Button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <Button
              variant="primary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-arrow-left"></i>
            </Button>
            <Button
              variant="primary"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastTask >= filteredTasks.length}
            >
              <i className="bi bi-arrow-right"></i>
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskList;
