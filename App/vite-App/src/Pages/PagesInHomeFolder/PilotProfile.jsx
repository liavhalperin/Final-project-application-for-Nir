import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';

const PilotProfile = () => {
    const navigate = useNavigate();
    const [searchLicenseNumber, sSearchLicenseNumber] = useState('');
    const [selectedPilot, sSelectedPilot] = useState(null);
    const location = useLocation();
    const obj = location.state?.obj || '';

    const GotoHomePage = (obj) => {
        navigate('/HomePageEm', { state: { obj } });
    };

    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Pilots/viewallpilots';

    const BySearch = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const foundPilot = data.find(pilot => pilot.licenseNumber === parseInt(searchLicenseNumber.trim(), 10));
            console.log('Found Pilot:', foundPilot);  // Log the found pilot
            sSelectedPilot(foundPilot);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const SendAMess = () => {
        const message = `היי ${selectedPilot.firstName} מה שלומך?\n מדבר/ת ${obj.firstName} מ IFLIGHT \n רציתי לשוחח איתך בנושא`;
        let whatsappLink;
        if (selectedPilot.phoneNumber) {
            whatsappLink = `https://wa.me/+972${selectedPilot.phoneNumber}?text=${encodeURIComponent(message)}`;
        } else {
            whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
        }
        window.open(whatsappLink, "_blank");
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
                <form>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            dir="rtl"
                            placeholder="אנא הקלד מספר רישיון"
                            style={inputStyle}
                            value={searchLicenseNumber}
                            onChange={(e) => sSearchLicenseNumber(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="contained"
                        onClick={BySearch}
                        sx={buttonStyle}
                    >
                        חפש
                    </Button>
                    <br /><br />
                    {selectedPilot && (
                        <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                    <span><b>שם מלא: </b></span>{`${selectedPilot.firstName} ${selectedPilot.lastName}`}
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                <span><b> תאריך לידה : </b></span>{new Date(selectedPilot.dob).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                    <span><b>מספר טלפון: </b></span>{selectedPilot.phoneNumber}
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                    <span><b>מספר תעודת זהות: </b></span>{selectedPilot.id}
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                    <span><b>תוקף מבחן רמה: </b></span>{new Date(selectedPilot.mivhanRama).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </p>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <p dir="rtl" style={inputStyle}>
                                    <span><b>תוקף תעודה רפואית: </b></span>{new Date(selectedPilot.medicalExpiry).toLocaleDateString('he-IL', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </p>
                            </div>
                            <Button
                                variant="contained"
                                onClick={SendAMess}
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'green',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    width: '100%',
                                    maxWidth: '300px',
                                    fontFamily: 'Arial, sans-serif',
                                    fontWeight: 'bold',
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease, color 0.3s ease',
                                }}
                            >
                                שליחת הודעה לטייס בווצאפ (דרך המחשב)
                            </Button>
                        </div>
                    )}
                    <br />
                    <Button
                        variant="contained"
                        onClick={() => GotoHomePage(obj)}
                        sx={buttonStyle}
                    >
                        חזור
                    </Button>
                </form>
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
    backgroundColor: 'white',
    color: 'blue',
    borderRadius: '20px',
    padding: '10px 20px',
    width: '100%',
    maxWidth: '300px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
};

export default PilotProfile;
