import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Watch = ({ setConditionalComponent }) => {
    const [tickets, setTickets] = useState([]);
    const [completeTickets, setCompleteTickets] = useState([]);
    const [pendingTickets, setPendingTickets] = useState([]);
    const [openTickets, setOpenTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const response = await axios.get("/api/client/fetchTicketByClient");
            console.log("Response from server => ", response.data);

            if (response.data.success === true) {
                const tempTickets = response.data.data.tickets;
                setTickets(tempTickets);
                setCompleteTickets(tempTickets.filter(e => e.status === "Closed"));
                setPendingTickets(tempTickets.filter(e => e.status === "In Progress"));
                setOpenTickets(tempTickets.filter(e => e.status === "Open"));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const ticketData = {
        labels: ["Completed Tickets", "Pending Tickets", "To-Do Tickets"],
        datasets: [
            {
                label: "Number of Tickets",
                data: [
                    completeTickets.length,
                    pendingTickets.length,
                    openTickets.length,
                ],
                borderColor: "#77AFDC",
                backgroundColor: "rgba(10, 10, 248, 0.99)",
                borderWidth: 2,
                pointBackgroundColor: "rgba(10, 10, 248, 0.99)",

                pointBorderColor: "#77AFDC",
                tension: 0.3, // Smooth line effect
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Ticket Statuses",
                    font: {
                        size: 16,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Tickets",
                    font: {
                        size: 16,
                    },
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mt-5">
            {/* Header Section */}
            <div className="row">
                <div className="col-md-12" onClick={() => setConditionalComponent("CompanyTasks")}>
                    <div className="row">
                        {/* Completed Tasks Card */}
                        <div className="col-12 col-sm-6 col-md-4 mb-4">
                            <div
                                className="card text-white"
                                style={cardStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = hoverStyle.boxShadow; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = cardStyle.boxShadow; }}>

                                <div className="card-header d-flex justify-content-center" style={headerStyle}>Completed Tickets</div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>{completeTickets.length} Tickets</h5>
                                </div>
                            </div>
                        </div>

                        {/* Pending Tasks Card */}
                        <div className="col-12 col-sm-6 col-md-4 mb-4">
                            <div
                                className="card text-white"
                                style={cardStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = hoverStyle.boxShadow; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = cardStyle.boxShadow; }}>
                                <div className="card-header d-flex justify-content-center" style={headerStyle}>Pending Tickets</div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>{pendingTickets.length} Tickets</h5>
                                </div>
                            </div>
                        </div>

                        {/* To-Do Tasks Card */}
                        <div className="col-12 col-sm-6 col-md-4 mb-4">
                            <div
                                className="card text-white"
                                style={cardStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = hoverStyle.boxShadow; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = cardStyle.boxShadow; }}>
                                <div className="card-header d-flex justify-content-center" style={headerStyle}>To-Do Tickets</div>
                                <div className="card-body">
                                    <h5 className="card-title d-flex justify-content-center" style={titleStyle}>{openTickets.length} Tickets</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Chart Section */}
            <div className="row mt-5">
                <div className="col-12">
                    <div style={{ height: "400px", width: "100%", overflowX: "auto" }}>
                        <Line data={ticketData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styling Variables
const cardStyle = {
    borderRadius: "10px",
    boxShadow: "4px 4px 15px rgba(0, 0, 0, 0.3), 8px 8px 25px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    cursor: "pointer",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#77AFDC",
};

const hoverStyle = {
    boxShadow: "6px 6px 30px rgba(0, 0, 0, 0.5), 12px 12px 40px rgba(0, 0, 0, 0.3)",
};

const headerStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
};

const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
};

export default Watch;
