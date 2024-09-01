import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';

const LoginPage = () => {
  const [LicenseNumber, setLicenseNumber] = useState('');
  const [ID, setID] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Pilots/pilotsignin';

  const location = useLocation();
  const successfullyregistered = location.state?.successfullyregistered;

  const GotoHomePage = (obj) => {
    navigate('/HomePage', { state: { obj } });
  };
  const GoBack = () => {
    navigate('/EmplOrUser');
  };
  const GotoRegistrationPage = () => {
    navigate('/RegistrationPage');
  };
  const Login = () => {
    if (!ID) {
      alert('ID are required');
      return;
    }
    if (!LicenseNumber) {
      alert('LicenseNumber are required');
      return;
    }
    const requestUrl = `${apiUrl}?LicenseNumber=${LicenseNumber}&ID=${ID}`;
    console.log(requestUrl);

    fetch(requestUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((result) => {
        console.log("fetch result: ", result);
        if (result && result.licenseNumber.toString() === LicenseNumber && result.id.toString() === ID) {
          setIsLoggedIn(true);
          GotoHomePage(result);
        } else {
          alert('Invalid LicenseNumber or ID');
        }
      })
      .catch((error) => {
        console.log("Fetch error: ", error);
        alert('Login failed');
      });
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
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {!isLoggedIn && (
          <div>
            <h1 style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px', fontFamily: 'Arial, sans-serif', color: 'white' }}>ברוכים הבאים</h1>
            <h3>{successfullyregistered}</h3>
            <input
              type="text"
              dir="rtl"
              placeholder="מספר רישיון"
              value={LicenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '235px',
                borderRadius: '20px',
                fontFamily: 'Arial, sans-serif',
                color: 'black',
                backgroundColor: 'white',
                padding: '10px',
                marginBottom: '10px'
              }}
            />
            <br />
            <input
              type="password"
              dir="rtl"
              placeholder="מספר תעודת זהות"
              value={ID}
              onChange={(e) => setID(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '235px',
                borderRadius: '20px',
                fontFamily: 'Arial, sans-serif',
                color: 'black',
                backgroundColor: 'white',
                padding: '10px'
              }}
            />
            <br /><br />
            <Button
              onClick={Login}
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#333',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '200px',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              התחבר
            </Button>
            <br /> <br />
            <Button
              onClick={GotoRegistrationPage}
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#4caf50',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '200px',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              הרשם
            </Button>
            <h6 style={{ fontFamily: 'Arial, sans-serif', color: 'white' }}>עדיין לא נרשמת?? בזריז להירשם</h6>
            <Button
              onClick={GoBack}
              sx={{
                marginRight: '7px',
                fontSize: '14px',
                padding: '8px 20px',
                backgroundColor: 'white',
                color: '#9c27b0',
                borderRadius: '20px',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s ease',
                fontFamily: 'Arial, sans-serif',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              חזור
            </Button>
            <br /><br />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
