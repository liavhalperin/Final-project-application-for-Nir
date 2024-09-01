import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FlightDocumentation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const obj = location.state?.obj || '';
    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/updateslot';

    const GotoHomePage = (obj) => {
        navigate('/HomePageEm', { state: { obj } });
    };

    const [flightData, sFlightData] = useState({
        FlightNumber: '',
        FlightDate: '',
        StartHobbs: '',
        EndHobbs: '',
        Tach: '',
        FuelAmount: '',
        NumOfPassengers: '',
        DepartTime: '',
        LandingTime: ''
    });

    const IfInputChange = (event) => {
        const { name, value } = event.target;
        sFlightData(prevState => ({ ...prevState, [name]: value }));
    };

    const IfFormSubmit = (event) => {
        event.preventDefault();
        const { FlightNumber, DepartTime, LandingTime, ...updatedSlot } = flightData;
        // מפרק את שעת ההמראה והנחיתה לשעה ודקה
        const [dHour, dMinute] = DepartTime ? DepartTime.split(':').map(Number) : [0, 0];
        const [lHour, lMinute] = LandingTime ? LandingTime.split(':').map(Number) : [0, 0];
        // ממיר את מספר הטיסה למספר שלם
        const flightNumberInt = parseInt(FlightNumber, 10);
        updatedSlot.FuelAmount = updatedSlot.FuelAmount ? parseInt(updatedSlot.FuelAmount, 10) : null;
        sendFlightDataToServer(flightNumberInt, updatedSlot, dHour, dMinute, lHour, lMinute);

        GotoHomePage(obj);
    };

    const sendFlightDataToServer = async (flightNumber, updatedSlot, dHour, dMinute, lHour, lMinute) => {
        try {
            const response = await fetch(`${apiUrl}?FlightNumber=${flightNumber}&DHour=${dHour}&DMinute=${dMinute}&LHour=${lHour}&LMinute=${lMinute}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(updatedSlot),
            });

            const responseBody = await response.text();
            console.log('Response:', responseBody);

            if (!response.ok) {
                console.error('Server responded with an error:', responseBody);
                return;
            }

            console.log('Data sent successfully to server');
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
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
                <h1>תיעוד טיסה</h1>
                <form onSubmit={IfFormSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>הכנס מספר טיסה</p>
                        <input type="text" dir="rtl" name="FlightNumber" value={flightData.FlightNumber} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>תאריך טיסה</p>
                        <input type="date" dir="rtl" name="FlightDate" value={flightData.FlightDate} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>תחילת Hobs</p>
                        <input type="text" dir="rtl" name="StartHobbs" value={flightData.StartHobbs} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>סיום Hobs</p>
                        <input type="text" dir="rtl" name="EndHobbs" value={flightData.EndHobbs} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>TACH</p>
                        <input type="text" dir="rtl" name="Tach" value={flightData.Tach} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>שעת המראה</p>
                        <input type="time" dir="rtl" name="DepartTime" value={flightData.DepartTime} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>שעת נחיתה</p>
                        <input type="time" dir="rtl" name="LandingTime" value={flightData.LandingTime} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>כמות דלק התחלתית</p>
                        <input type="text" dir="rtl" name="FuelAmount" value={flightData.FuelAmount} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: 0, padding: 0, border: 0 }}>מספר הנוסעים</p>
                        <input type="number" dir="rtl" name="NumOfPassengers" value={flightData.NumOfPassengers} onChange={IfInputChange} style={inputStyle} />
                    </div>
                    <button type="submit" style={buttonStyle}>עדכן</button>
                    <br />
                    <button type="button" onClick={() => GotoHomePage(obj)} style={buttonStyle}>חזור</button>
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
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'green',
    padding: '10px 20px',
    margin: '10px',
    width: '100%', // Full width for mobile devices
    maxWidth: '300px', // Limit the width for larger screens
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease, color 0.3s ease',
};

export default FlightDocumentation;
