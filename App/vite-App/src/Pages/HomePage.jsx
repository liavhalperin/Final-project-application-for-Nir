import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';

const HomePage = () => {
  const [profileImage, sProfileImage] = useState(null);
  const [loading, sLoading] = useState(true);
  const [error, sError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state?.obj || '';

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/GetImage/getprofileimage/${obj.licenseNumber}`);
        if (!response.ok) {
          sProfileImage('/Default_profile_picture.png');
        }
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        sProfileImage(imageObjectURL);
      } catch (error) {
        sError(error.message);
        sProfileImage('/Default_profile_picture.png');
      } finally {
        sLoading(false);
      }
    };

    if (obj.licenseNumber) {
      fetchImage();
    }
  }, [obj.licenseNumber]);

  const MoveToFlightSearch = () => {
    navigate('/FindAFlight', { state: { obj } });
  };
  const MoveToFlightConditions = () => {
    navigate('/FlightConditions');
  };
  const movetoCommunicationWithPilots = () => {
    navigate('/CommunicationWithPilots', { state: { obj } });
  };
  const movetoProfileandedit = () => {
    navigate('/Profileandedit', { state: { obj } });
  };
  const MoveToPersonalArea = () => {
    navigate('/PersonalArea', { state: { obj } });
  };
  const FlightsPast = () => {
    navigate('/FlightsPast', { state: { obj } });
  };
  const BackToLoginPage = () => {
    navigate('/LoginPage');
  };
  const GoBack = () => {
    navigate('/EmplOrUser', { state: { obj } });
  }
  const GotoWeather = () => {
    navigate('/Weather', { state: { obj } });
  }
  const GotoArticles = () => {
    navigate('/Articles', { state: { obj } });
  }
  const FutureUserFlight = () => {
    navigate('/FutureUserFlight', { state: { obj } });
  }

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
        <img src="logo.png" alt="Logo" style={{ width: '100%', maxWidth: '200px', marginBottom: '10px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          {error && <h6 style={{ marginBottom: '5%', marginTop: '0%', paddingTop: '0%' }}>יש להעלות תמונת פרופיל</h6>}
          {!loading && profileImage && (
            <img src={profileImage} alt="Profile" style={{ width: '33%', maxWidth: '150px', borderRadius: '60%' }} />
          )}
        </div>

        <h2 style={{ color: 'white' }}>שלום, {obj.firstName}</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={FutureUserFlight}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#ff5c8d',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          טיסות עתידיות
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={MoveToFlightSearch}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#ff5c8d',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          שריין טיסה
        </Button>
        <Button
          variant="contained"
          onClick={movetoCommunicationWithPilots}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#008000',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          תקשורת עם טייסים
        </Button>
        <Button
          variant="contained"
          onClick={movetoProfileandedit}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#0000ff',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#bbb',
            },
          }}
        >
          צפייה בפרופיל
        </Button>
        <Button
          variant="contained"
          onClick={GotoWeather}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#4caf50',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          בדיקת מז"א
        </Button>
        <Button
          variant="contained"
          onClick={FlightsPast}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#ff9800',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          טיסות עבר
        </Button>
        <Button
          variant="contained"
          onClick={GotoArticles}
          sx={{
            marginBottom: '20px',
            backgroundColor: 'white',
            color: '#ff9800',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '10px 30px',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s ease',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#ccc',
            },
          }}
        >
          פורום טייסים
        </Button>
        <br />
        <Button
          onClick={BackToLoginPage}
          sx={{
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
          התנתק
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
