import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const Contact = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const obj = location.state?.obj || '';
    const GotoHomePage = (obj) => {
        navigate('/HomePage', { state: { obj } });
    };


    return (
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', minHeight: '70vh', minWidth: '136%', backgroundSize: 'cover', backgroundImage: `url('src/Pages/imgs/homeimg.png')` }}>
            <div style={{ textAlign: 'center', width: '100%' }}>            משקל ואיזון
                <br />  <br />
                <button onClick={() => GotoHomePage(obj)} style={{ marginRight: '5px', borderRadius: '20px', backgroundColor: 'white', color: 'purple' }}>חזור אל דף הבית</button>
            </div>
        </div>
    );
};
export default Contact;