import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

const LoginPageEm = () => {
    const [PasswordKey, setPasswordKey] = useState('');
    const [id, setID] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Employees/employeesignin';

    const GotoHomePage = (obj) => {
        navigate('/HomePageEm', { state: { obj } });
    };

    const GoBack = () => {
        navigate('/EmplOrUser');
    };

    const Login = () => {
        if (!id) {
            alert('ID is required');
            return;
        }
        if (!PasswordKey) {
            alert('PasswordKey is required');
            return;
        }

        const requestUrl = `${apiUrl}?PasswordKey=${PasswordKey}&ID=${id}`;
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
                if (result && result.passwordKey.toString() === PasswordKey && result.id.toString() === id) {
                    setIsLoggedIn(true);
                    GotoHomePage(result);
                } else {
                    alert('Invalid Password or ID');
                }
            })
            .catch((error) => {
                console.log("Fetch error: ", error);
                alert('Login failed');
            });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundSize: 'cover',
            backgroundImage: `url('homeimg.png')`,
            padding: '20px',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            <div style={{ marginBottom: '120px',width: '100%', maxWidth: '400px' }}>
                {!isLoggedIn && (
                    <div>
                        <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif', color: 'white' }}>ברוכים הבאים</h1>
                        <input
                            type="text"
                            dir="rtl"
                            placeholder="מספר תעודת זהות"
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            style={{...inputStyle, marginBottom: '7px' }}
                        />
                        <br />
                        <input
                            type="password"
                            dir="rtl"
                            placeholder="סיסמא"
                            value={PasswordKey}
                            onChange={(e) => setPasswordKey(e.target.value)}
                            style={{ ...inputStyle, marginBottom: '20px' }}
                        />
                        <br />
                        <Button
                            onClick={Login}
                            variant="contained"
                            sx={buttonStyle}
                        >
                            התחבר
                        </Button>
                        <br />
                        <Button
                            onClick={GoBack}
                            sx={backButtonStyle}
                        >
                            חזור
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '20px',
    fontFamily: 'Arial, sans-serif',
    color: 'black',
    backgroundColor: 'white',
    padding: '10px',
    boxSizing: 'border-box',
    textAlign: 'right'
};

const buttonStyle = {
    width: '100%',
    maxWidth: '300px',
    backgroundColor: 'white',
    color: '#333',
    borderRadius: '20px',
    padding: '10px 20px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontFamily: 'Arial, sans-serif',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#ccc',
    },
};

const backButtonStyle = {
    width: '100%',
    maxWidth: '300px',
    backgroundColor: 'white',
    color: '#9c27b0',
    borderRadius: '20px',
    padding: '10px 20px',
    marginTop: '10px',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    fontFamily: 'Arial, sans-serif',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#ccc',
    },
};

export default LoginPageEm;
