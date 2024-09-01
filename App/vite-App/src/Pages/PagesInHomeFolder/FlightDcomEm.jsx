import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const FlightDocumentation = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', backgroundImage: 'url("src/Pages/imgs/homeimg.png")' }}>
            <h1>תיעוד טיסות</h1>
            <form >
                <h2>מספר טיסה 123</h2>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="הכנס תאריך תחילת טיסה" style={{ direction: 'rtl', ...inputStyle }} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="הכנס תאריך סיום טיסה" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="תחילת Hobs" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="סיום Hobs" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="TACH" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="שעת המראה" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="שעת נחיתה" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="כמות דלק התחלתית" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '20px', marginRight: '20px', marginLeft: '20px' }}>
                    <input type="text" dir="rtl" placeholder="מספר נוסעים" style={inputStyle} />
                </div>
                <button type="submit" style={buttonStyle}>עדכן</button>
                <br />
                <button onClick={() => navigate('/HomePage')} style={buttonStyle}>חזור</button>
            </form>
        </div>
    );
};

const inputStyle = {
    borderRadius: '20px',
    fontFamily: 'Arial, sans-serif',
    color: 'black',
    backgroundColor: 'white',
    padding: '10px',
    width: '300px',
};

const buttonStyle = {
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'green',
    padding: '10px 20px',
    margin: '10px',
};

export default FlightDocumentation;
