import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Hamburger = () => {
    const navigate = useNavigate();
    const buttonStyle = {
        backgroundColor: 'blue',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    };

    return (
        <div style={{ textAlign: 'center', backgroundImage: 'url("src/Pages/imgs/homeimg.png")' }}>
            <form >
                <button onClick={() => navigate('/FlightDocumentation')} style={buttonStyle}>תיעוד טיסות</button> <br /> <br />
                <button onClick={() => navigate('/CommunicationWithPilots')} style={buttonStyle}>תקשורת עם טייסים</button> <br /> <br />
                <button onClick={() => navigate('/ViewAndUpdateProfile')} style={buttonStyle}>פרופיל הטייס</button> <br /> <br />
                <button onClick={() => navigate('/HomePage')} style={buttonStyle}>חזור</button> <br /> <br />
            </form>
        </div>
    );
};

export default Hamburger;
