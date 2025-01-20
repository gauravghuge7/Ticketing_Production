import React from 'react';
import './Footer.css'; // You can style it as per your needs

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-1 mt-auto">
      <div className="container-fluid"> {/* Changed from container to container-fluid */}
        <div className="row d-flex justify-content-between align-items-center">
          {/* Left Section */}
          <div className="col-md-3 text-center">
            <p>© {new Date().getFullYear()} GBIS. All rights reserved.</p>
          </div>

        

          {/* Right Section - Company Link */}
          <div className="col-md-6 text-right">
            <a href="https://gbisinc.com" className="text-white">
              Global Business Infotech Solutions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
