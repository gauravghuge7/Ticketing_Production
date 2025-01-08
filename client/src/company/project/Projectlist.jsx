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
      <div
  style={{
    maxHeight: "400px", // Set fixed height for vertical scrolling
    overflowY: "scroll", // Enable vertical scrolling
    overflowX: "auto", // Enable horizontal scrolling
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    whiteSpace: "nowrap", // Prevent table content from wrapping
  }}
>
  <Table
    striped
    bordered
    hover
    responsive={false} // Disable Bootstrap's responsive table behavior to control scroll
    style={{
      backgroundColor: "#fff",
      color: "#333",
      borderRadius: "8px",
    }}
  >
    <thead
      style={{
        backgroundColor: "#007BFF",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <tr>
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
      {filteredProjects.length > 0 ? (
        filteredProjects.map((data, index) => (
          <tr key={index}>
            <td>{data?.projectName}</td>
            <td>{data?.spokePersonEmail}</td>
            <td>{data?.spokePersonName}</td>
            <td>{data?.spokePersonNumber}</td>
            <td>{data?.team?.map((team) => team?.teamLead?.join(", "))}</td>
            <td>
              {expandedDescriptions[data._id]
                ? data?.description
                : `${data?.description.slice(0, 50)}...`}
                {data?.description.length > 50 && (
              <Button
                variant="link"
                style={{ padding: 0, marginLeft: "5px" }}
                onClick={() => toggleDescription(data._id)}
              >
                {expandedDescriptions[data._id] ? "-" : "+"}
              </Button>
            )}
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
          <td colSpan="8" className="text-center">
            No projects available
          </td>
        </tr>
      )}
    </tbody>
  </Table>
</div>

    </Container>
  );
};

export default ProjectList;
