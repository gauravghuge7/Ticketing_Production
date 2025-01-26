import { useEffect, useState } from 'react';
import { Container, Table, Button, FormControl, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX library

const TaskProjectList = ({ setConditionalComponent, setProjectId }) => {
  const [projectData, setProjectData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    sapType: '',
    ticketName: '',
    projectName: '',
    ticketId: '',
    status: '',
    startDate: '', // New start date filter
    endDate: '',   // New end date filter
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const projectsPerPage = 10;

  const getProjects = async () => {
    try {
      const response = await axios.get('/api/client/fetchAllClientTickets');
      if (response.data.success) {
        console.log("response", response);
        setProjectData(response.data.data.totalTickets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const sendProjectId = (Id) => {
    setProjectId(Id);
    setConditionalComponent('tasklist');
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const filteredProjects = projectData.filter((project) => {
    const ticketDate = new Date(project.tickets.createdDate);
    const startDate = searchFilters.startDate ? new Date(searchFilters.startDate) : null;
    const endDate = searchFilters.endDate ? new Date(searchFilters.endDate) : null;

    return (
      (!searchFilters.sapType || project.tickets.saptype === searchFilters.sapType) &&
      (!searchFilters.ticketName || project.tickets.ticketName?.toLowerCase().includes(searchFilters.ticketName.toLowerCase())) &&
      (!searchFilters.projectName || project.tickets.projectName === searchFilters.projectName) &&
      (!searchFilters.ticketId || project.tickets.ticketId?.toLowerCase().includes(searchFilters.ticketId.toLowerCase())) &&
      (!searchFilters.status || project.tickets.status === searchFilters.status) &&
      (!startDate || ticketDate >= startDate) && // Check if the ticket's date is after or equal to start date
      (!endDate || ticketDate <= endDate)        // Check if the ticket's date is before or equal to end date
    );
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects
    .sort((a, b) => b.tickets.ticketId.localeCompare(a.tickets.ticketId)) // Sort in descending order
    .slice(indexOfFirstProject, indexOfLastProject); // Apply pagination

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      currentProjects.map((data) => ({
        "Ticket ID": data.tickets.ticketId,
        "Project Name": data.tickets.projectName,
        "Ticket Name": data.tickets.ticketName,
        "Priority": data.tickets.priority,
        
        "SAP Type": data.tickets.saptype,
        "Status": data.tickets.status,
        "Spokesperson Email": data.tickets.assignedByEmail,
        "Spokesperson Name": data.tickets.assignedByName,
        "Spokesperson Number": data.tickets.assignedTo,
        "Description": data.tickets.ticketDescription,
        "Document": data.tickets.ticketDocument,
        "Created Date": data.tickets.createdDate || new Date().toLocaleDateString(), // Use the ticket's created date if available
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");
    XLSX.writeFile(wb, "tickets_list.xlsx");
  };

  return (
    <Container
      style={{
        background: '#f0f4f8',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        color: '#333',
      
        marginTop: '30px',
        overflow: 'auto',


      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>Ticket List</h2>
        <Button variant="success" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>

      {/* Filters Section */}
      <Row className="mb-3">
        <Col>
          <FormControl
            placeholder="Ticket ID"
            name="ticketId"
            value={searchFilters.ticketId}
            onChange={handleFilterChange}
          />
        </Col>
        <Col>
          <FormControl
            placeholder="Ticket Name"
            name="ticketName"
            value={searchFilters.ticketName}
            onChange={handleFilterChange}
          />
        </Col>
        <Col>
          <Form.Control
            as="select"
            name="projectName"
            value={searchFilters.projectName || ''}
            onChange={handleFilterChange}
            className="custom-select"
          >
            <option value="">Select Project</option>
            {Array.from(new Set(projectData.map((project) => project.tickets.projectName)))
              .filter(Boolean)
              .map((projectName, index) => (
                <option key={index} value={projectName}>
                  {projectName}
                </option>
              ))}
          </Form.Control>
        </Col>
        <Col>
          <Form.Control
            as="select"
            name="sapType"
            value={searchFilters.sapType || ''}
            onChange={handleFilterChange}
            className="custom-select"
          >
            <option value="">SAP Module</option>
            {Array.from(new Set(projectData.map((project) => project.tickets.saptype)))
              .filter(Boolean)
              .map((sapType, index) => (
                <option key={index} value={sapType}>
                  {sapType}
                </option>
              ))}
          </Form.Control>
        </Col>
        <Col>
          <Form.Control
            as="select"
            name="status"
            value={searchFilters.status || ''}
            onChange={handleFilterChange}
            className="custom-select"
          >
            <option value="">Status</option>
            {Array.from(new Set(projectData.map((project) => project.tickets.status)))
              .filter(Boolean)
              .map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
          </Form.Control>
        </Col>
        <Col>
          <FormControl
            type="date"
            name="startDate"
            value={searchFilters.startDate}
            onChange={handleFilterChange}
            placeholder="Start Date"
          />
        </Col>
        
      </Row>

      {/* Table Section */}
      <Table
        striped
        bordered
        hover
        responsive
        style={{
          backgroundColor: "#fff",
            color: "#333",
            borderRadius: "12px",
            overflow: "hidden",
        }}
      >
        <thead
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
          }}
        >
          <tr>
            <th>#</th>
            <th>Ticket ID</th>
            <th>Project Name</th>
            <th>Ticket Name</th>
            <th>Priority</th>
            <th>Creation Date</th> {/* New column added */}
            <th>SAP Type</th>
            <th>Status</th>
            <th>Spokesperson Email</th>
            <th>Spokesperson Name</th>
            <th>Spokesperson Number</th>
            <th>Description</th>
            <th>Document</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((data, index) => (
              <tr key={index}>
                <td>{index + 1 + indexOfFirstProject}</td>
                <td>{data.tickets.ticketId}</td>
                <td>{data.tickets.projectName}</td>
                <td>{data.tickets.ticketName}</td>
                <td>{data.tickets.priority}</td>
                <td>{data.tickets.createdDate || new Date().toLocaleDateString()}</td>
                <td>{data.tickets.saptype}</td>
                <td>{data.tickets.status}</td>
                <td>{data.tickets.assignedByEmail}</td>
                <td>{data.tickets.assignedByName}</td>
                <td>{data.tickets.assignedTo}</td>
                <td>{data.tickets.ticketDescription}</td>
                <td>
                  <a href={data.tickets.ticketDocument} target="_blank" rel="noopener noreferrer">
                    <Button variant="" style={{ color: '#007BFF' }}>
                      <i className="bi bi-eye-fill"></i>
                    </Button>
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="13" className="text-center">
                No Tickets available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-3">
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
          disabled={indexOfLastProject >= filteredProjects.length}
        >
          <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
    </Container>
  );
};

export default TaskProjectList;
