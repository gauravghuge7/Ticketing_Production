import axios from "axios";
import { useEffect, useState } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { message } from "react-message-popup";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from "react-router-dom";

const LeadProjects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  const projectsPerPage = 10;
  const { teamId } = useParams();

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`/api/employee/fetchProjectByTeamId/${teamId}`);
      
      // Log the data to ensure it's coming through correctly
      console.log("Fetched Projects: ", response.data);

      // Set projects if response is successful and has data
      setProjects(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Failed to fetch projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [teamId]);

  const navigate = useNavigate();

  const handleProject = (projectId) => {
    navigate(`/employee/viewteamleadproject/${teamId}/${projectId}`);
  };


  const handleDocumentView = (projectId) => {
    console.log("View document for project:", projectId);
    // Implement document view logic if needed
  };

  const getUniqueClients = () => {
    const clients = projects.map(project => project.clientName);
    return [...new Set(clients)];
  };

  const filteredProjects = projects.filter(project =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedClient === "" || project.clientName === selectedClient)
  );

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className="container mt-4"
      style={{
        background: "#f0f4f8",
        padding: "40px",
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
          maxWidth: "100%",
        }}
      >
        <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>
          Projects That You Are Leading
        </h2>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '50%' }}>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">All Clients</option>
            {getUniqueClients().map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
          <InputGroup>
            <FormControl
              placeholder="Search Project Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

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
          <th scope="col">#</th>
            <th scope="col">Client Name</th>
            <th scope="col">Project Name</th>
            <th scope="col">Spokesperson Name</th>
            <th scope="col">Spokesperson Email</th>
            <th scope="col">Spokesperson Number</th>
            <th scope="col">Description</th>
            <th scope="col">Document</th>
            <th scope="col">View Work</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{project.clientName}</td>
                <td>{project.projectName}</td>
                <td>{project.spokePersonName}</td>
                <td>{project.spokePersonEmail}</td>
                <td>{project.spokePersonNumber}</td>
                <td>{project.description}</td>
                <td>
                  <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    color: "#007BFF",
                    fontWeight: "bold",
                    transition: "background-color 0.3s ease",
                  }}
                    onClick={() => handleDocumentView(project._id)}
                    className=""
                  >
                  <i className="bi bi-eye-fill" style={{ fontSize: "16px", color: "#007BFF" }}></i></button>
                </td>
                <td> 
                  <button style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      color: "#007BFF",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => handleProject(project._id)}
                    className=""
                  >
                    
                  You're Work</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-primary"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <button
          className="btn btn-primary"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastProject >= filteredProjects.length}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default LeadProjects;
