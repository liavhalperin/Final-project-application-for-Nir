import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import SendAMess from './SendAMess';

const HomePageEm = () => {
    const navigate = useNavigate();

    const FlightDocumentation = () => {
        navigate('/FlightDocumentation', { state: { obj } });
    };
    const PilotProfile = () => {
        navigate('/PilotProfile', { state: { obj } });
    };
    const MoveToContact = () => {
        navigate('/Contact');
    };
    const BackToLoginPage = () => {
        navigate('/LoginPageEm');
    };
    const Schedule_a_new_flight = () => {
        navigate('/Schedule_a_new_flight', { state: { obj } });
    };
    const AllFlights = () => {
        navigate('/AllFlights', { state: { obj } });
    };
    const AlertsForPilots = () => {
        navigate('/AlertsForPilots', { state: { obj } });
    };

    const location = useLocation();
    const obj = location.state?.obj || '';

    return (
        <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            // minHeight: '100vh',
            height: '110%',
            // height: '100%',
            width: '100%',
            backgroundSize: 'cover',
            backgroundImage: `url('homeimg.png')`,
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                <img src="logo.png" alt="Logo" style={{ width: '100%', maxWidth: '200px', marginBottom: '20px' }} />
                <h2>שלום, {obj.firstName}</h2>
                <Button
                    variant="contained"
                    onClick={() => AllFlights(obj)}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#0000FF',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    כל הטיסות
                </Button>
                <Button
                    variant="contained"
                    onClick={() => Schedule_a_new_flight(obj)}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#0000FF',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    אישור או דחיית בקשות
                </Button>
                <Button
                    variant="contained"
                    onClick={() => FlightDocumentation(obj)}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#ff9800',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    תיעוד טיסות
                </Button>
                <Button
                    variant="contained"
                    onClick={() => PilotProfile(obj)}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#ff9800',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    חיפוש טייסים
                </Button>
                <Button
                    variant="contained"
                    onClick={() => AlertsForPilots(obj)}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: 'green',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        width: '100%',
                        maxWidth: '300px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    תוקף רישיונות טייסים 
                </Button>
                <Button
                    onClick={BackToLoginPage}
                    sx={{
                        fontSize: '14px',
                        padding: '8px 20px',
                        backgroundColor: 'white',
                        color: '#9c27b0',
                        borderRadius: '20px',
                        width: '100%', 
                        maxWidth: '300px',
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

export default HomePageEm;
