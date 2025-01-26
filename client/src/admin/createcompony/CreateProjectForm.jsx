import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { message } from 'react-message-popup';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

const CreateProjectForm = ({ clientId, clientName }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        companyName: '',
        spokePersonEmail: '',
        spokePersonName: '',
        spokePersonNumber: '',
        description: '',
        team: "team",
        projectId: "",
        document: "",
        file: ""
    });

    // Get data from the redux store
    const teams = useSelector(state => state.teamReducer.team);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const onImageChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = new FormData();
            body.append('projectName', formData.projectName);
            body.append('companyName', formData.companyName);
            body.append('spokePersonEmail', formData.spokePersonEmail);
            body.append('spokePersonName', formData.spokePersonName);
            body.append('spokePersonNumber', formData.spokePersonNumber);
            body.append('description', formData.description);
            body.append('team', formData.team);
            body.append('projectId', formData.projectId);
            body.append('client', clientId);
            body.append('clientName', clientName);
            if (formData.file) {
                body.append('file', formData.file);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            };

            const response = await axios.post("/api/admin/project", body, config);

            if (response.data.success) {
                message.success(response.data.message);

                // Reset the form
                setFormData({
                    projectName: '',
                    companyName: '',
                    spokePersonEmail: '',
                    spokePersonName: '',
                    spokePersonNumber: '',
                    description: '',
                    team: "team",
                    projectId: "",
                    document: "",
                    file: ""
                });
            }
        } catch (error) {
            console.error("Error submitting the project:", error);
            message.error(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="p-4 border-0" style={{ borderRadius: '20px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ fontWeight: 'bold' }}>
                                Create New Project for <b>{clientName}</b>
                            </h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="projectId" className="mb-3">
                                    <Form.Label>Project ID</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="projectId"
                                        value={formData.projectId}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="projectName" className="mb-3">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="spokePersonName" className="mb-3">
                                    <Form.Label>Spokesperson Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="spokePersonName"
                                        value={formData.spokePersonName}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="spokePersonEmail" className="mb-3">
                                    <Form.Label>Spokesperson Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="spokePersonEmail"
                                        value={formData.spokePersonEmail}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="spokePersonNumber" className="mb-3">
                                    <Form.Label>Spokesperson Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="spokePersonNumber"
                                        value={formData.spokePersonNumber}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    />
                                </Form.Group>

                                <Form.Group controlId="team" className="mb-3">
                                    <Form.Label>Team</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="team"
                                        value={formData.team}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: '12px', padding: '1px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    >
                                        <option value="team">Select Team</option>
                                        {teams.map((team, index) => (
                                            <option key={index} value={team._id}>{team.teamName}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Project Description</Form.Label>
                                    <textarea
                                        cols="50"
                                        className="w-full border p-2"
                                        placeholder="Add project description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ borderRadius: '12px', padding: '10px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)' }}
                                    ></textarea>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Select Document</Form.Label>
                                    <input
                                        type="file"
                                        onChange={onImageChange}
                                        accept="*"
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    style={{
                                        backgroundColor: 'primary',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px 24px',
                                        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                    className="w-100"
                                >
                                    Submit Project
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateProjectForm;
