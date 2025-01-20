import  { useEffect, useState } from 'react';
import MyCalendar from './MyCalendar';
import axios from 'axios';

const Employeecontain = ({ setConditionalComponent }) => {


    const [completeTickets, setCompleteTickets] = useState();
    const [pendingTickets, setPendingTickets] = useState();
    const [openTickets, setOpenTickets] = useState();

    const fetchTickets = async () => {

        try {

            const response = await axios.get("/api/employee/getEmployeeAllTasks");

            console.log(" Response from server =>  ", response.data);

            if(response.data.success === true){

                console.log(" Tickets =>  ", response.data.data);

                const tempTickets = response.data.data;
            
                setCompleteTickets(tempTickets.filter(e => e.status === "Closed"));
                console.log("complete tickets =>  ", completeTickets?.length);
                setPendingTickets(tempTickets.filter(e => e.status === "In Progress"));
                setOpenTickets(tempTickets.filter(e => e.status === "Open"));
            }


            
        } 
        catch (error) {
            console.log(error);
        }
        finally {
            console.log("finally");
        }
    };


    useEffect(() =>{
        fetchTickets();
    }, [])

    


    return (
        <div className="container mt-5"
            
        >
            {/* Header Section */}
            <div className="row">
                <div className="col-md-12"
                    onClick={() => setConditionalComponent("projects")}
                >
                    <div className="row"> 
                        {/* Completed Tasks Card */}
                        <div className="col-md-4 mb-4">
                            <div
                                className="card text-white bg-info"
                                style={cardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                                }}
                            >
                                <div className="card-header d-flex justify-content-center align-items-center" style={headerStyle}>
                                    <i className="bi bi-check-circle me-2"></i> Completed Tasks
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>
                                        {completeTickets?.length} Tasks
                                    </h5>
                                    <p className="card-text" style={textStyle}>
                                        All tasks that have been successfully completed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Tasks Card */}
                        <div className="col-md-4 mb-4">
                            <div
                                className="card text-white bg-info"
                                style={cardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                                }}
                            >
                                <div className="card-header d-flex justify-content-center align-items-center" style={headerStyle}>
                                    <i className="bi bi-hourglass-split me-2"></i> Pending Tasks
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>
                                        {pendingTickets?.length} Tasks
                                    </h5>
                                    <p className="card-text" style={textStyle}>
                                        Tasks that are still in progress and need to be completed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* To-Do Tasks Card */}
                        <div className="col-md-4 mb-4">
                            <div
                                className="card text-white bg-info"
                                style={cardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = hoverStyle.boxShadow;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                                }}
                            >
                                <div className="card-header d-flex justify-content-center align-items-center" style={headerStyle}>
                                    <i className="bi bi-list-task me-2"></i> To-Do Tasks
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>
                                        {openTickets?.length} Tasks
                                    </h5>
                                    <p className="card-text" style={textStyle}>
                                        Tasks that are planned but not yet started.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Section */}
                        <div className="col-md-12 d-flex align-items-space-between">
                            <div className="col-md-12 me-2">
                                <MyCalendar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    borderRadius: '10px',
    boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.3), 8px 8px 25px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '400px',
};

const hoverStyle = {
    boxShadow: '6px 6px 30px rgba(0, 0, 0, 0.5), 12px 12px 40px rgba(0, 0, 0, 0.3)',
};

const headerStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
};

const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
};

const textStyle = {
    fontSize: '1rem',
};

export default Employeecontain;
