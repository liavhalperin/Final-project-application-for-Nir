import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const getAllSlotsApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/getallslots';

// עמוד טיסות עבר
const FlightsPast = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const obj = location.state?.obj || '';
    const [flights, sFlights] = useState([]); // כל הטיסות

    useEffect(() => {
        console.log('מביא את כל הטיסות');
        fetch(getAllSlotsApiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('כל הטיסות :', data);
                const pastFlights = data.filter(flight => flight.pilotLicenseNumber === obj.licenseNumber && dayjs(flight.flightDate).isBefore(dayjs()));
                sFlights(pastFlights);
            })
            .catch(error => {
                console.error('Error fetching all slots:', error);
            });
    }, [obj.licenseNumber]);

    const formatTime = (timeString) => {
        if (!timeString) return ''; 
        const [hour, minute] = timeString.split(':');
        return `${hour}:${minute}`;
    };

    const calculateHobbs = (departTime, landingTime) => {
        if (!departTime || !landingTime) return ''; 

        const depart = dayjs(`2024-01-01T${departTime}`);
        const landing = dayjs(`2024-01-01T${landingTime}`);
        const diffMinutes = landing.diff(depart, 'minute');

        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;

        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundSize: 'cover',
            backgroundImage: 'url("homeimg.png")',
            padding: '20px',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>טיסות עבר</h1>
                <button style={buttonStyle} onClick={() => navigate(-1)} > חזור  </button>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', marginBottom: '25px', padding: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: 'rgba(0, 51, 102, 0.8)', color: 'white' }}>
                                <th style={{ padding: '6px', border: '1px solid black' }}>סה"כ שעות הובס</th>
                                <th style={{ padding: '6px', border: '1px solid black' }}>שעת נחיתה</th>
                                <th style={{ padding: '6px', border: '1px solid black' }}>שעת המראה</th>
                                <th style={{ padding: '6px', border: '1px solid black' }}>מספר טיסה</th>
                                <th style={{ padding: '6px', border: '1px solid black' }}>תאריך טיסה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'rgba(173, 216, 230, 0.3)' : 'rgba(173, 216, 230, 0.1)' }}>
                                    <td style={{ fontSize: '15px', padding: '10px', border: '1px solid rgba(0, 51, 102, 0.8)', color:'white' }}>{calculateHobbs(flight.departTime, flight.landingTime)} </td>
                                    <td style={{ fontSize: '15px', padding: '10px', border: '1px solid rgba(0, 51, 102, 0.8)', color:'white' }}>{formatTime(flight.landingTime)}</td>
                                    <td style={{ fontSize: '15px', padding: '10px', border: '1px solid rgba(0, 51, 102, 0.8)', color:'white' }}>{formatTime(flight.departTime)}</td>
                                    <td style={{ fontSize: '15px', padding: '10px', border: '1px solid rgba(0, 51, 102, 0.8)', color:'white' }}>{flight.flightNumber}</td>
                                    <td style={{ fontSize: '15px', padding: '10px', border: '1px solid rgba(0, 51, 102, 0.8)', color:'white' }}>{dayjs(flight.flightDate).format('YYYY-MM-DD')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const buttonStyle = {
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'green',
    padding: '10px 30px',
    width: '100%',
    maxWidth: '125px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '1px solid green',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    marginBottom: '20px'
};

export default FlightsPast;
