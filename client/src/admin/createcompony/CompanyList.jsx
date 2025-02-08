import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, FormControl, InputGroup , Modal, Form } from 'react-bootstrap';
import { message } from 'react-message-popup';
import { useNavigate } from 'react-router-dom';

const CompanyList = ({ setValue, setClientId, setClientName}) => {
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
  
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);          

    const fetchCompanies = async () => {
        try {
            const response = await axios.get("/api/admin/getAllClients");
            if (response.data.success) {
                message.success(response.data.message);
                setCompanies(response.data.data.clientList);
            }
        } catch (error) {
            message.error(error.message);
        }
    };
  

    const handleDelete = async(id) => {
        // Implement delete functionality
        console.log(`Delete client with id: ${id}`);
        try {
            const response = await axios.delete(`/api/admin/deleteClient/${id}`);
            console.log("API Response:", response.data);
            if (response.data.success) {
                setCompanies((prevCompanies) => prevCompanies.filter((client) => client._id !== id));
                alert("Client deleted successfully!");
            }
        } 
        catch (error) {
            console.error("Error deleting client:", error);
        }

    };

   
    
    const handleEdit = async(company) => {
        setSelectedCompany(company);
        setShowEditModal(true);
    };
    
    const handleEditSubmit = async () => {
        if (!selectedCompany) return;
        console.log("Submitting edit for:", selectedCompany);
        try {
            const response = await axios.put(`/api/admin/editClient/${selectedCompany._id}`, selectedCompany);
            console.log("API Response:", response.data);
            if (response.data.success) {
                setCompanies((prevCompanies) =>
                    prevCompanies.map((client) =>
                        client._id === selectedCompany._id ? { ...client, ...selectedCompany } : client
                    )
                );
                alert("Company updated successfully!");
                setShowEditModal(false);
            }
        } 
        catch (error) {
            console.error("Error updating client:", error);
        }
    };  
    // const handleEditSubmit = async () => {
    //     if (!editClient) return;
    //     console.log("Submitting edit for:", editClient);
    //     try {
    //         const response = await axios.put(`/api/admin/updateClient/${editClient._id}`, editClient);
    //         console.log("API Response:", response.data);
    //         if (response.data.success) {
    //             setCompanies((prevCompanies) =>
    //                 prevCompanies.map((client) =>
    //                     client._id === editClient._id ? { ...client, ...editClient } : client
    //                 )
    //             );
    //             alert("Client updated successfully!");
    //             setValue("company");
    //         }
    //     } 
    //     catch (error) {
    //         console.error("Error updating client:", error);
    //     }
    // };  



    const navigate = useNavigate();

    
    


    useEffect(() => {
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const companiesPerPage = 10;
    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

    const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

    return (
        <Container
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Client List</h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <InputGroup style={{ maxWidth: "300px", marginRight: "10px" }}>
                        <FormControl
                            placeholder="Search Client"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* <InputGroup.Text>
                            <i className="bi bi-search"></i>
                        </InputGroup.Text> */}
                    </InputGroup>
                    <Button
                        style={{ backgroundColor: "#007BFF", border: "none", whiteSpace: "nowrap", borderRadius: "8px", color: "#fff", fontWeight: "bold", transition: "background-color 0.3s ease", }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
                        onClick={() => navigate("/admin/createcompany")}
                    >
                        Add New Client
                    </Button>
                </div>
            </div>

            <Row className="justify-content-md-center">
                <Col md={12}>
                    {currentCompanies.length > 0 ? (
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
                                    <th>Client Name</th>
                                    <th>Client Email/ID</th>
                                    <th style={{ width: "150px" }}>Password</th>
                                    <th style={{ textAlign: "center" }}>Add Project</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCompanies.map((company, index) => (
                                    <tr key={index}>
                                        <td>{indexOfFirstCompany + index + 1}</td>
                                        <td>{company.clientName}</td>
                                        <td>{company.clientEmail}</td>
                                        <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {company.clientPassword}
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <Button style={{ background: "transparent", border: "none", textAlign: "center" }} onClick={() => navigate(`/admin/addproject/${company._id}/${company.clientName}`)}>
                                                <i className="bi bi-plus-square-fill" style={{ fontSize: "16px", color: "#007BFF" }}></i>
                                            </Button>
                                        </td>

                                        <div className='d-flex'>
                                            <Button variant="" onClick={() => handleEdit(company)} style={{ color: "#007BFF" }} className="me-2">
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                            <Button variant="" onClick={() => handleDelete(company._id)} style={{ color: "red" }}>
                                                <i className="bi bi-trash-fill"></i>
                                            </Button>
                                        </div>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p style={{ color: "#333" }}>No companies registered yet.</p>
                    )}
                </Col>
            </Row>



           {/* Edit Model */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCompany && (
                        <Form>                        
                            <Form.Group controlId="formCompanyName">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter company name"
                                    value={selectedCompany.clientName}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, clientName: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCompanyEmail">
                                <Form.Label>Company Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter company email"
                                    value={selectedCompany.clientEmail}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, clientEmail: e.target.value })}
                                />
                                
                            </Form.Group>
                            <Form.Group controlId="formCompanyPassword">
                                <Form.Label>Company Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={selectedCompany.clientPassword}
                                    onChange={(e) => setSelectedCompany({ ...selectedCompany, clientPassword: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Save Changes
                    </Button>

                </Modal.Footer>                
            </Modal>        

















            <div className="d-flex justify-content-between mt-3">
                <Button
                    variant="primary"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <i className="bi bi-arrow-left"></i>
                </Button>
                <Button
                    variant="primary"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    <i className="bi bi-arrow-right"></i>
                </Button>
            </div>
        </Container>
    );
};

export default CompanyList;