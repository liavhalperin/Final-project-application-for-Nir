import React from 'react';
import { useNavigate } from "react-router-dom";
const FlightConditions = () => {
const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', height: '100vh', backgroundImage: `url('src/Pages/imgs/homeimg.png')` }}>
            <div style={{ textAlign: 'center' }}>            מזג אויר
                <br />  <br />
                <button onClick={() => navigate('/HomePageEm')} style={{ marginRight: '5px', borderRadius: '20px', backgroundColor: 'white', color: 'purple' }}>חזור אל דף הבית</button>

            </div>
        </div>
    );
};
export default FlightConditions;


