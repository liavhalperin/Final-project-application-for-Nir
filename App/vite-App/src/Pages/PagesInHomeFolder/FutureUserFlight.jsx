import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert, Collapse } from '@mui/material';
import dayjs from 'dayjs';

const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/getallslots';

const AllFlights = () => {
  const [flights, sFlights] = useState([]);
  const [filteredFlights, sFilteredFlights] = useState([]);
  const [notificationOpen, sNotificationOpen] = useState(false);
  const [notificationMessage, sNotificationMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state?.obj || '';
  const pilotLicenseNumber = obj.licenseNumber;

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        sFlights(data);
        const futureFlights = data.filter(flight => flight.pilotLicenseNumber === pilotLicenseNumber);
        console.log("Future flights:", futureFlights);
        sFilteredFlights(futureFlights);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
      });
  }, [pilotLicenseNumber]);
  const CloseNotification = () => {
    sNotificationOpen(false);
  };

  return (
    <div style={{
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundSize: 'cover',
      backgroundImage: `url('homeimg.png')`,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        <h1 style={{color: 'white'}}>טיסות עתידיות שלך</h1>
        <button onClick={() => navigate('/HomePage', { state: { obj } })} style={buttonStyle}>חזור אל דף הבית</button>
        <br /><br />
        {/* <Collapse in={filteredFlights.length > 0}> */}
        <div style={{ width: '100%', marginBottom: '20px' }}>
          {filteredFlights.length === 0 ? (
            <p>No future flights available.</p>
          ) : (
            filteredFlights.map((flight, index) => (
              <div key={index} style={flightStyle}>
                <p>מספר רישיון: {flight.pilotLicenseNumber}</p>
                <p>מספר טיסה: {flight.flightNumber}</p>
                <p>בתאריך: {dayjs(flight.flightDate).format('YYYY-MM-DD')}</p>
                {/* <p>בתאריך: {flight.flightDate}</p> */}
                <p>שעת המראה: {flight.departTime || 'N/A'}</p>
                <p>שעת נחיתה: {flight.landingTime || 'N/A'}</p>
              </div>
            ))
          )}
        </div>
        {/* </Collapse> */}
        <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={CloseNotification}>
          <Alert onClose={CloseNotification} severity="info" sx={{ width: '100%' }}>{notificationMessage}</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

const buttonStyle = {
  borderRadius: '20px',
  backgroundColor: 'white',
  color: 'green',
  padding: '10px 20px',
  margin: '10px',
  width: '100%',
  maxWidth: '300px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const flightStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '10px',
  borderRadius: '9px',
  marginBottom: '10px',
  color: 'white',
};

export default AllFlights;
