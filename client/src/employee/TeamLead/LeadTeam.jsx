import axios from 'axios';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const LeadTeam = () => {
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`/api/employee/isTeamLead`);
      console.log("response.data => ", response.data);

      if (response.data.success) {
        console.log("response.data.data => ", response.data.data);
        setTeams(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  
  const navigate = useNavigate();

  const setTeamOfProject = (teamId) => {
    navigate(`/employee/leadprojects/${teamId}`);
  };
  



  return (
    <div
      style={{
        backgroundColor: '#f9fafc',
        padding: '100px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        marginTop: '30px',
      
      
      }}
    >
      <h2 className="text-center" style={{ color: '#1a1a1a', fontWeight: '700', letterSpacing: '1px' }}>
        Teams That You Are Leading
      </h2>
      <hr style={{ borderTop: '3px solid #007BFF', width: '60%', margin: '20px auto' }} />
      <div className="container">
        <div className="row">
          {teams?.map((team, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <div
                className="card shadow-sm"
                style={{
                  borderRadius: '16px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div
                  className="card-body"
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '24px',
                    textAlign: 'center',
                    borderRadius: '16px',
                  }}
                >
                  <h5
                    className="card-title"
                    style={{ 
                      color: '#2c3e50',
                      fontWeight: '700',
                      fontSize: '1.3rem',
                      marginBottom: '12px'
                    }}
                  >
                    {team.teamName}
                  </h5>
                  <h6
                    className="card-subtitle"
                    style={{ 
                      color: '#6c757d',
                      fontSize: '0.95rem',
                      marginBottom: '24px',
                      fontWeight: '500'
                    }}
                  >
                    ID: {team.teamId}
                  </h6>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setTeamOfProject(team._id)}
                    style={{
                      borderRadius: '10px',
                      fontWeight: '600',
                      padding: '10px 20px',
                      backgroundColor: '#0066cc',
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#0052a3';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#0066cc';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    View Team
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadTeam;
