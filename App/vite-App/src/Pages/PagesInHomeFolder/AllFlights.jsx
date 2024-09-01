import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay, DayCalendarSkeleton } from '@mui/x-date-pickers';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Snackbar, Alert, Collapse } from '@mui/material';
import Badge from '@mui/material/Badge';
import dayjs from 'dayjs';

const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/getallslots';

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const formattedDay = day.format('YYYY-MM-DD');
  const isSelected = !outsideCurrentMonth && highlightedDays.includes(formattedDay);

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '✈️' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} sx={{ color: 'black' }} />
    </Badge>
  );
}

const AllFlights = () => {
  const [selectedDate, ssSelectedDate] = useState(null);
  const [highlightedDays, ssHighlightedDays] = useState([]);
  const [flights, ssFlights] = useState([]);
  const [showFlights, ssShowFlights] = useState(false);
  const [notificationOpen, ssNotificationOpen] = useState(false);
  const [notificationMessage, ssNotificationMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state?.obj || '';

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const dates = data.filter(slot => slot.flightDate).map(slot => dayjs(slot.flightDate).format('YYYY-MM-DD'));
        ssHighlightedDays(dates);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  }, []);

  const hDayClick = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    if (selectedDate === formattedDate) {
      ssSelectedDate(null);
      ssShowFlights(false);
    } else {
      ssSelectedDate(formattedDate);
      fetchFlightsForDate(formattedDate);
    }
  };

  const fetchFlightsForDate = (date) => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // מסנן את כל הטיסות שאין להם תאריך או שעה
        const filteredFlights = data.filter(flight => {
          const flightDate = dayjs(flight.flightDate).format('YYYY-MM-DD') === date;
          const hasValidTimes = flight.departTime && flight.landingTime;
          return flightDate && hasValidTimes;
        });  
        ssFlights(filteredFlights);
        ssShowFlights(true);
      })
      .catch(error => {
        console.error('Error fetching flights:', error);
      });
  };

  const hCloseNotification = () => {
    ssNotificationOpen(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      // height: '100%',
      width: '100%',
      backgroundSize: 'cover',
      backgroundImage: `url('homeimg.png')`,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '322px' }}>
        <h1>כל הטיסות</h1>
        <button onClick={() => navigate('/HomePageEm', { state: { obj } })} style={buttonStyle}>חזור אל דף הבית</button>
        <br /><br />
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', width: '100%', maxWidth: '333px', marginBottom: '20px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) => hDayClick(date)}
              renderLoading={() => <DayCalendarSkeleton />}
              slots={{ day: ServerDay }}
              slotProps={{ day: { highlightedDays } }}
              sx={{
                '& .MuiPickersDay-root': {
                  color: 'black',
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <Collapse in={showFlights}>
          <div style={{ width: '100%', marginBottom: '20px', height:'100%' }}>
            {flights.length === 0 ? (
              <p>No flights available for this date.</p>
            ) : (

              flights.map((flight, index) => (
                <div key={index} style={flightStyle}>
                  <p>מספר רישיון: {flight.pilotLicenseNumber}</p>
                  <p>מספר טיסה: {flight.flightNumber}</p>
                  <p>בתאריך: {dayjs(flight.flightDate).format('YYYY-MM-DD')}</p>
                  <p>זמן המראה: {flight.departTime || 'N/A'}</p>
                  <p>זמן נחיתה: {flight.landingTime || 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        </Collapse>
        <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={hCloseNotification}>
          <Alert onClose={hCloseNotification} severity="info" sx={{ width: '100%', height:'120%' }}>{notificationMessage}</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

const buttonStyle = {
  borderRadius: '20px',
  backgroundColor: 'white',
  color: 'green',
  padding: '10px 20px',
  margin: '10px',
  width: '100%',
  maxWidth: '200px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const flightStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '10px',
  borderRadius: '9px',
  marginBottom: '10px',
  color: 'white',
};

export default AllFlights;
