import React, { useEffect, useState } from 'react';
import { Container, Table, Button, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import EditProjectForm from './EditProjectForm';

const ProjectList = ({ setConditionalComponent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [currentProject, setCurrentProject] = useState({
    projectName: '',
    spokePersonEmail: '',
    spokePersonName: '',
    spokePersonNumber: '',
    description: '',  
    teamLead: '',
    _id: "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const handleAddTask = (data) => {
    setIsEditing(true);
    setCurrentProject(data);
  };

  const getProjects = async () => {
    try {
      const response = await axios.get('/api/client/fetchProjects');
      console.log(response.data);

      if (response.data.success) {
        setProjectData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const filteredProjects = projectData.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (updatedData) => {
    setProjectData(updatedData);
    setIsEditing(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isEditing) {
    return (
      <EditProjectForm 
        currentProject={currentProject} 
        setConditionalComponent={setConditionalComponent}
        onSave={handleSave}
        setIsEditing={setIsEditing}
      />
    );
  }

  // Add the CSS class for horizontal scrolling
  const tableContainerStyle = {
    overflowX: 'auto',
  };

  // Wrap the table in a div with the CSS class
  return (
    <Container
      style={{
        background: "#f0f4f8",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
        color: "#333",
        maxWidth: "100%",
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
        <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Project List</h2>
        <InputGroup style={{ maxWidth: "30%" }}>
          <FormControl
            placeholder="Search Project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>
      <div style={tableContainerStyle}>
         <Table
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
              <th>Project Name</th>
              <th>Spokesperson Email</th>
              <th>Spokesperson Name</th>
              <th>Spokesperson Number</th>
              <th>Team Lead</th>
              <th>Description</th>
              <th>Document</th>
              <th>Add Ticket</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data?.projectName}</td>
                  <td>{data?.spokePersonEmail}</td>
                  <td>{data?.spokePersonName}</td>
                  <td>{data?.spokePersonNumber}</td>
                  <td>{data?.team?.map(team => team?.teamLead?.join(", "))}</td>

                  <td>
                    {expandedDescriptions[data._id] || data.description.length <= 50
                      ? data?.description
                      : `${data?.description.slice(0, 50)}...`}
                       {data.description.length > 50 && (
                    <Button
                      variant="link"
                      style={{ padding: 0, marginLeft: "5px" }}
                      onClick={() => toggleDescription(data._id)}
                    >
                      {expandedDescriptions[data._id] ? "-" : "+"}
                    </Button> )}
                  </td>
                  <td>
                    
                  <a href={data?.descriptionDocument} target="_blank" rel="noreferrer">
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          color: "#007BFF",
                          fontWeight: "bold",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </Button>
                    </a>
                  </td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "transparent",
                        border: "#007BFF",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        color: "#007BFF",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                        marginRight: "10px",
                      }}
                      onClick={() => handleAddTask(data)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No projects available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            backgroundColor: "#007BFF",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
        >
          <i className="bi bi-arrow-left"></i>
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            backgroundColor: "#007BFF",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
          }}
        >
          <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
    </Container>
  );
};

export default ProjectList;
