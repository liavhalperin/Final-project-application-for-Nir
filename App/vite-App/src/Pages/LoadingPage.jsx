import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const sTimeout = setTimeout;
  const navigate = useNavigate();

  useEffect(() => {
    const loadingTimer = sTimeout(() => {
      navigate('/EmplOrUser');
    }, 3000);

    return () => clearTimeout(loadingTimer);
  }, [navigate]);

  return (
    <>
      <style>{
      `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #111;
        }

        .custom-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100%;
          background-size: cover;
          background-image: url('homeimg.png');
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          overflow: hidden;
        }

        .airplane {
          font-size: 230px; 
          position: absolute;
          top: 45%; 
          left: 50%;
          transform: translate(-50%, -50%);
          animation: rotateIcon 3s linear infinite; /* Rotate speed */
        }

        @keyframes rotateIcon {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg); /* Full rotation */
          }
        }
      `
      }</style>
      <div className="custom-container">
        <div className="airplane">✈️</div>
      </div>
    </>
  );
};

export default LoadingPage;
