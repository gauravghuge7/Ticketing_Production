import { useEffect, useState } from 'react';
import EditProjectForm from './EditProjectForm';
import axios from 'axios';
import { message } from 'react-message-popup';
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { use } from 'react';
import { useSelector } from 'react-redux';



const ProjectList = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');


    // const data = useSelector((state) => state.projectReducer.project);

      
    // useEffect(() => {
    //     setProjectData(data);
    // }, [data]);


    const handleEdit = async (id) => {
        try {
            const response = await axios.put(`/api/admin/editProject/${id}`, projectData);
            if (response.status === 200) {
            message.success('Project updated successfully');
            getAllProjects();
            } else {
            message.error('Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            message.error('Failed to update project');
        }
    };

    const handleDelete = async (id) => {
        console.log(id);
        const response = await axios.delete(`/api/admin/deleteProject/${id}`);
        console.log(response);
        if (response.data.success) {
            message.success('Project deleted successfully');
            getAllProjects();
        } else {
            message.error('Failed to delete project');
        }
    };




    const projectsPerPage = 10;

    

    const getAllProjects = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.get('/api/admin/project', config);

            console.log('response => ', response);

            if (response.data.success === true) {
                message.success(response.data.message);
                setProjectData(response?.data?.data?.project);
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message);
        }
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    const handleSave = (updatedData) => {
        setProjectData(updatedData);
        setIsEditing(false);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProjects = projectData.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (isEditing) {
        return <EditProjectForm projectData={projectData} onSave={handleSave} />;
    }

    return (
        <div
            className="container mt-5"
            style={{
                background: "#f0f4f8",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                color: "#333",
                maxWidth: "100%",
            }}
        >
              
            <Row className="mb-4">
                <Col>
                <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Project List</h2>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col>
                    {/* <InputGroup>
                        <FormControl
                            placeholder="Search Projects"
                            aria-label="Search Projects"
                            aria-describedby="basic-addon2"
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ borderRadius: "8px", maxWidth: "100%", marginRight: "10px" }}
                        />
                    </InputGroup> */}


                    
                <InputGroup style={{ maxWidth: "100%" }}>
                    <FormControl
                        placeholder="Search Projects"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {/* <InputGroup.Text>
                        <i className="bi bi-search"></i>
                    </InputGroup.Text> */}
                </InputGroup>
                </Col>
            </Row>
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
                        <th>Client </th>
                        <th>Project</th>
                    
                        <th>Spokesperson Email</th>
                        <th>Spokesperson Name</th>
                        <th>Spokesperson Number</th>
                        <th>Team Lead</th>
                        <th>Description</th>
                        <th>Document</th>
                        <th>Actions</th>
                        {/* <th>Tickets</th> */}
                    </tr>
                </thead>
                <tbody>
                    {currentProjects.map((data, index) => (
                        <tr key={index}>
                            <td>{indexOfFirstProject + index + 1}</td>
                            <td>{data.clientName}</td>
                            <td>{data.projectName}</td>

                            <td>{data.spokePersonEmail}</td>
                            <td>{data.spokePersonName}</td>
                            <td>{data.spokePersonNumber}</td>
                            <td>{data.team?.map((teamMember) => teamMember.teamLead).join(', ')}</td>
                            <td>{data.description}</td>
                            <td>
                                <a href={data.descriptionDocument} target="_blank" rel="noreferrer" style={{ color: "#007BFF" }}>
                                    <Button style={{ background: "transparent", border: "none", color: "#007BFF" }}>
                                            <i className="bi bi-eye-fill" style={{ fontSize: "16px" }}></i>
                                            
                                        </Button>
                                    </a>
                                </td>
                                <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {/* <Button style={{ background: "transparent", border: "none" }} onClick={() => handleEdit(data._id)}>
                            <i className="bi bi-pencil-square" style={{ color: "#007BFF" }} ></i>
                        </Button> */}
                        <Button style={{ background: "transparent", border: "none" }} onClick={() => handleDelete(data._id)}>
                            <i className="bi bi-trash-fill" style={{ fontSize: "16px", color: "red", cursor: "pointer" }}></i>
                        </Button>
                    </div>
                </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
                <Button
                    style={{
                        backgroundColor: "primary",
                        border: "none",
                        color: "white",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "primary")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "primary")}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-arrow-left" style={{ fontSize: "16px", color: "white" }}></i>
                </Button>
                <Button
                    style={{
                        backgroundColor: "primary",
                        border: "none",
                        color: "white",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "primary")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "primary")}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastProject >= filteredProjects.length}
                >
                    <i className="bi bi-arrow-right" style={{ fontSize: "16px", color: "white" }}></i>
                </Button>
            </div>
        </div>
    );
};

export default ProjectList;
