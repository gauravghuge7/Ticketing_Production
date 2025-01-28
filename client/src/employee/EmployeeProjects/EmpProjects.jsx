import {
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import {
  Button,
  Container,
  Form,
  Table, FormControl, InputGroup
} from 'react-bootstrap';

const EmpProjects = () => {

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const [tasksPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [ticketIdFilter, setTicketIdFilter] = useState('');
  const [ticketNameFilter, setTicketNameFilter] = useState('');
  const [sapModuleFilter, setSapModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchProjects = async () => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const response = await axios.get('/api/employee/getProjects', config);

      console.log("response.data.data", response.data.data);

      if (response.data.success) {
        setProjects(response.data.data[0].project);
      }
    } catch (error) {
      console.log(error);
    }
  };




  const viewOurWork = async (projectId) => {
    try {
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const response = await axios.get(`/api/employee/getTasksByProjectId/${projectId}`, config);

      console.log("response.data", response.data);

      console.log(response.data.data);


      if (response.data.success) {
        setTasks(response.data.data);
        setTeam(response.data.anythingElse)
        setSelectedProjectId(projectId);
      }


    } 
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getUniqueClients = () => {
    const clients = [...new Set(projects.map(project => project.clientName))];
    return clients;
  };

  const getUniqueSapModules = () => {
    const modules = [...new Set(tasks.map(task => task.ticket?.saptype).filter(Boolean))];
    return modules;
  };

  const getUniqueStatuses = () => {
    const statuses = [...new Set(tasks.map(task => 
      task.ticket ? task.ticket.status : task.status
    ).filter(Boolean))];
    return statuses;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClient = clientFilter === 'all' || project.clientName === clientFilter;
    
    return matchesSearch && matchesClient;
  });

  const filteredTasks = tasks.filter(task => {
    const ticketId = task.ticket?.ticketId?.toLowerCase() || '';
    const ticketName = (task.ticket ? task.ticket.ticketName : task.taskName).toLowerCase();
    const sapModule = task.ticket?.saptype || '';
    const status = task.ticket ? task.ticket.status : task.status;
    const taskDate = new Date(task.createdAt || task.ticket?.createdAt || task.project?.createdAt);

    const matchesTicketId = !ticketIdFilter || ticketId.includes(ticketIdFilter.toLowerCase());
    const matchesTicketName = !ticketNameFilter || ticketName.includes(ticketNameFilter.toLowerCase());
    const matchesSapModule = sapModuleFilter === 'all' || sapModule === sapModuleFilter;
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    const matchesDate = (!dateFilter.startDate || taskDate >= new Date(dateFilter.startDate)) &&
                       (!dateFilter.endDate || taskDate <= new Date(dateFilter.endDate));

    return matchesTicketId && matchesTicketName && matchesSapModule && 
           matchesStatus && matchesDate;
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const forwardTicketRef = useRef(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [forwardTicketOpen, setForwardTicketOpen] = useState(false);

  
  const openForwardTicketDialog = (taskId) => {

    setCurrentTask(taskId);
    


    if (forwardTicketRef.current) {

      forwardTicketRef.current.showModal();
    }
    setForwardTicketOpen(true);
  };

  const closeForwardTicketDialog = (e) => {

    console.log(e);

    if (forwardTicketRef.current) {
      forwardTicketRef.current.close();
    }
    setForwardTicketOpen(false);
    setCurrentTask(null);
  };


  const [sendTask, setSendTask] = useState({
    taskId: currentTask?._id,
    employeeId: null,
  });

  const handleForwardTicket = async () => {
    try {

      const body = {
        employeeId: sendTask.employeeId,
        taskId: sendTask.taskId,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      

      const response = await axios.post('/api/employee/forwardTicketsAndTasksToAnotherEmployee', body, config)
      
      
      console.log("response.data => ", response.data);

      

    } 
    catch (error) {
      console.log(error);  
    }
  }

  const clearAllFilters = () => {
    setTicketIdFilter('');
    setTicketNameFilter('');
    setSapModuleFilter('all');
    setStatusFilter('all');
    setDateFilter({
      startDate: '',
      endDate: ''
    });
  };

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
  
  
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            
<h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Projects</h2>
                <div style={{ display: "flex", gap: "15px", maxWidth: "60%" }}>
                  <Form.Select 
                    style={{ maxWidth: "200px" }}
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                  >
                    <option value="all">Clients</option>
                    {getUniqueClients().map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </Form.Select>
                  <InputGroup style={{ maxWidth: "300px" }}>
                    <FormControl
                      placeholder="Projects"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </div>
          </div>
    
      <div className="table-responsive">
        <Table
          striped
          bordered
          hover
          className="text-center"
      
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
              <th>Project Name</th>
              <th>Team</th>
              <th>Spokesperson Name</th>
              <th>Spokesperson Email</th>
              <th>Phone Number</th>
              <th>Description</th>
              <th>Document</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{project.clientName}</td>
                <td>{project.projectName}</td>
                <td>{project.team}</td>
                <td>{project.spokePersonName}</td>
                <td>{project.spokePersonEmail}</td>
                <td>{project.spokePersonNumber}</td>
                <td>{project.description}</td>
               
                <td>
                    <a href={project.descriptionDocument} target="_blank" rel="noreferrer">
                      <Button variant="" style={{ color:"#007BFF" }}>
                        <i className="bi bi-eye-fill"></i>
                      </Button>
                    </a>
                  </td>
                <td>
                  <Button style={{ background: "transparent", border: "none" }}  onClick={() => viewOurWork(project._id)}>
                    <i className="bi bi-plus-square-fill" style={{ fontSize: "16px", color: "#007BFF" }}></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
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
      <hr style={{ margin: "40px 0" }} />
      {tasks.length > 0 && selectedProjectId && (
        <section style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#333", fontWeight: "bold" }}>Your Tickets for Project</h2>
              <Button 
                variant="outline-secondary"
                onClick={clearAllFilters}
                style={{ padding: "5px 15px" }}
              >
                Clear All Filters
              </Button>
            </div>
            
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <InputGroup style={{ maxWidth: "200px" }}>
                <FormControl
                  placeholder="Ticket ID"
                  value={ticketIdFilter}
                  onChange={(e) => setTicketIdFilter(e.target.value)}
                />
              </InputGroup>

              <InputGroup style={{ maxWidth: "200px" }}>
                <FormControl
                  placeholder="Ticket Name"
                  value={ticketNameFilter}
                  onChange={(e) => setTicketNameFilter(e.target.value)}
                />
              </InputGroup>

              <Form.Select 
                style={{ maxWidth: "200px" }}
                value={sapModuleFilter}
                onChange={(e) => setSapModuleFilter(e.target.value)}
              >
                <option value="all"> SAP Modules</option>
                {getUniqueSapModules().map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </Form.Select>

              <Form.Select 
                style={{ maxWidth: "200px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Status</option>
                {getUniqueStatuses().map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>

              <InputGroup style={{ maxWidth: "200px" }}>
                <FormControl
                  type="date"
                  placeholder="Start Date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({...prev, startDate: e.target.value}))}
                />
              </InputGroup>

              {/* <InputGroup style={{ maxWidth: "200px" }}>
                <FormControl
                  type="date"
                  placeholder="End Date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({...prev, endDate: e.target.value}))}
                />
              </InputGroup> */}
            </div>
          </div>

          <Table
          striped
          bordered
          hover
          className="text-center"
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "100%",
          }}
        >
          <thead
            style={{
              backgroundColor: "#343a40",
              color: "#fff",
              fontSize: "1.1rem",
            }}
          >
              <tr>
                <th>#</th>
                <th>Ticket Type</th>
                <th>Ticket ID</th>
                <th>Ticket Name</th>
                <th>SAP Module</th>
                 <th>Creation Date</th>
                <th>Due Date</th>
                <th>Spokesperson</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Description</th>
                <th>Document</th>
                <th>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task, index) => (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td>{index + 1}</td>
                  <td>{task.ticket ? "Client Ticket" : "Team Lead Task"}</td>  
                  <td>{task.ticket ? task.ticket.ticketId : "-"}</td>
                  <td>{task.ticket ? task.ticket.ticketName : task.taskName}</td>
                  <td>{task.ticket ? task.ticket.saptype : ""}</td>
                  <td>{new Date(task.createdAt || task.ticket?.createdAt || task.project?.createdAt).toISOString().split('T')[0]}</td>
                  <td>{new Date(task.dueDate).toISOString().split('T')[0] || new Date(task.project?.dueDate).toISOString().split('T')[0]}</td>
                  <td>{task.ticket ? task.ticket.assignedByName : task.teamLead}</td>
                  <td>{task.priority ? task.priority : task.ticket.priority}</td>
                  <td>{task.ticket ? task.ticket.status : task.status}</td>
                  <td>{task.ticket ? task.ticket.ticketDescription : task.description}</td>
                  <td>
                    <a href={task.ticket?.ticketDocument || task.taskDocument} target="_blank" rel="noreferrer">
                      <Button  style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      color: "#007BFF",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease",
                    }}variant="primary"><i className="bi bi-eye-fill" ></i></Button>
                    </a>
                  </td>
                  <td>
                  <Button style={{
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "5px",
                      color: "#007BFF",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease",
                    }}
                      variant="primary"
                      onClick={() => openForwardTicketDialog(task)}

                    >
                      Forward 
                    </Button>
                  </td>
                </tr>
              ))}
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
          disabled={indexOfLastTask >= filteredTasks.length}
        >
         <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
        </section>
      )}



      <main>
        <section className="d-flex justify-content-center align-items-center">
        
          <dialog
          ref={forwardTicketRef}
          className="p-6 rounded-lg shadow-lg bg-white"
          style={{
            width: '300px',
            border: '1px solid #ccc',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <h2 className="text-xl font-bold mb-4">Forward Ticket</h2>
          <h2 className="text-xl mb-4">{currentTask?.taskName}</h2>
          <form
            onSubmit={() => handleForwardTicket()}
          >
            <div className="mb-4">
              <label htmlFor="employee" className="block mb-2">Select Employee</label>
              <select
                name="employee"
                id="employee"
                value={sendTask.employeeId}
                onChange={(e) => setSendTask({...sendTask, employeeId: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">Select employee</option>
                {team.employeeDetails && 
                  team.employeeDetails.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.employeeName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Forward
              </button>
              <button
                type="button"
                onClick={closeForwardTicketDialog}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </form>
          </dialog>
        </section>
      </main>


    </Container>
  );
};

export default EmpProjects;
