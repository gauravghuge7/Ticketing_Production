import  { useEffect, useState } from 'react';
import { Container, Table, Button, FormControl, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const TaskProjectList = ({ setConditionalComponent, setProjectId }) => {
  const [projectData, setProjectData] = useState([{
    tickets: {
      projectName: "Akash",
      spokePersonEmail: "akash@gmail.com",
      spokePersonName: "Akash",
      spokePersonNumber: 1234567890,
    }
  }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const projectsPerPage = 10;

  const getProjects = async () => {
    try {
      const response = await axios.get('/api/client/fetchAllClientTickets');

      
      if (response.data.success) {
        console.log("response", response?.data?.data?.totalTickets);
        setProjectData(response.data.data.totalTickets);

        console.log("data => ", projectData)
      }
    } 
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

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

  const filteredProjects = projectData?.filter((project) =>
    project?.projectName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

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
        <InputGroup style={{ maxWidth: '30%' }}>
          <FormControl
            placeholder="Search Project Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>
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
            <th>Project Name</th>
            <th>Spokesperson Email</th>
            <th>Spokesperson Name</th>
            <th>Spokesperson Number</th>
            <th>Team Lead</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projectData?.length > 0 ? (
            projectData.map((data, index) => (
              <tr key={index}>
                <td>{data?.tickets?.projectName}</td>
                <td>{data?.tickets?.assignedByEmail}</td>
                <td>{data?.tickets?.assignedByName}</td>
        
        

                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
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
