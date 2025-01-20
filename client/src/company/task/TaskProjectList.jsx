import { useEffect, useState } from 'react';
import { Container, Table, Button, FormControl, InputGroup, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

const TaskProjectList = ({ setConditionalComponent, setProjectId }) => {
  const [projectData, setProjectData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({
    sapType: '',
    ticketName: '',
    projectName: '',
    ticketId: '',
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const projectsPerPage = 10;

  const getProjects = async () => {
    try {
      const response = await axios.get('/api/client/fetchAllClientTickets');
      if (response.data.success) {
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
    return (
      (!searchFilters.sapType || project.tickets.saptype?.toLowerCase().includes(searchFilters.sapType.toLowerCase())) &&
      (!searchFilters.ticketName || project.tickets.ticketName?.toLowerCase().includes(searchFilters.ticketName.toLowerCase())) &&
      (!searchFilters.projectName || project.tickets.projectName?.toLowerCase().includes(searchFilters.projectName.toLowerCase())) &&
      (!searchFilters.ticketId || project.tickets.ticketId?.toLowerCase().includes(searchFilters.ticketId.toLowerCase()))
    );
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container
      style={{
        background: '#f0f4f8',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        color: '#333',
        maxWidth: '95%',
        marginTop: '30px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>Ticket List</h2>
      </div>

      <Row className="mb-3">
      <Col>
          <FormControl
            placeholder=" Ticket ID"
            name="ticketId"
            value={searchFilters.ticketId}
            onChange={handleFilterChange}
          />
        </Col>
        <Col>
          <FormControl
            placeholder="Project Name"
            name="projectName"
            value={searchFilters.projectName}
            onChange={handleFilterChange}
          />
        </Col>
      
        <Col>
          <FormControl
            placeholder=" Ticket Name"
            name="ticketName"
            value={searchFilters.ticketName}
            onChange={handleFilterChange}
          />
        </Col>
        
        <Col>
          <FormControl
            placeholder=" SAP Type"
            name="sapType"
            value={searchFilters.sapType}
            onChange={handleFilterChange}
          />
        </Col>
      </Row>

      <Table
        striped
        bordered
        hover
        responsive
        style={{
          backgroundColor: '#fff',
          color: '#333',
          borderRadius: '12px',
          overflow: 'hidden',
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
              <td colSpan="12" className="text-center">
                No Tickets available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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
