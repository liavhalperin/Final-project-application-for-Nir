import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const EmplOrUser = () => {
    const navigate = useNavigate();

    const GoToLoginPage = () => {
        navigate('/LoginPage');
    };

    const GotoLoginPageEm = () => {
        navigate('/LoginPageEm');
    };

    const GoBack = () => {
        navigate('/EmplOrUser');
    };

    const buttonStyle = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            // height: '120%',
            width: '100%',
            backgroundSize: 'cover',
            backgroundImage: `url('homeimg.png')`,
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <img src="logo.png" alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
            <Button
                variant="contained"
                onClick={GoToLoginPage}
                sx={{
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    color: '#4caf50',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '10px 30px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s ease',
                    fontFamily: 'Arial, sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#ccc',
                    },
                    width: '100%',
                    maxWidth: '300px' 
                }}
            >
                כניסת טייסים
            </Button>
            <Button
                variant="contained"
                onClick={GotoLoginPageEm}
                sx={{
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    color: '#2196f3',
                    fontWeight: 'bold',
                    borderRadius: '20px',
                    padding: '10px 30px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    transition: 'background-color 0.3s ease',
                    fontFamily: 'Arial, sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: '#ccc',
                    },
                    width: '100%', 
                    maxWidth: '300px' 
                }}
            >
                כניסת עובדים
            </Button>
        </div>
    );
};

export default EmplOrUser;
