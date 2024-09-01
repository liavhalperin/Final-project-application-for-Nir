import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay, DayCalendarSkeleton } from '@mui/x-date-pickers';
import Badge from '@mui/material/Badge';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Select, MenuItem, ListItemText, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';

const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/getallslots';
const sendMessageApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Messages/addmessage';

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
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const FindAFlight = () => {
  const [selectedDate, sSelectedDate] = useState(dayjs());
  const [highlightedDays, sHighlightedDays] = useState([]);
  const [occupiedSlots, sOccupiedSlots] = useState([]);
  const [departureTime, sDepartureTime] = useState('');
  const [landingTime, sLandingTime] = useState('');
  const [notificationOpen, sNotificationOpen] = useState(false);
  const [notificationMessage, sNotificationMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state?.obj || '';

  const departureTimes = ["06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30"];
  const landingTimes = [...departureTimes];

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const dates = data.filter(slot => slot.flightDate).map(slot => dayjs(slot.flightDate).format('YYYY-MM-DD'));
        sHighlightedDays(dates);
        sOccupiedSlots(data);
      })
      .catch(error => {
        console.error('Error fetching slots:', error);
      });
  }, []);

  const filterTimes = (times, occupiedTimes) =>
    times.map(time => ({
      time,
      isOccupied: occupiedTimes.includes(time)
    }));

  const getOccupiedTimesForDate = (date) => {
    const selectedDate = dayjs(date).format('YYYY-MM-DD');
    console.log('Date format during getOccupiedTimesForDate:', selectedDate);
    const slotsForDate = occupiedSlots.filter(slot => dayjs(slot.flightDate).format('YYYY-MM-DD') === selectedDate);
    const occupiedTimes = [];

    slotsForDate.forEach(slot => {
      const start = dayjs(slot.departTime, 'HH:mm');
      const end = dayjs(slot.landingTime, 'HH:mm');
      let currentTime = start;

      while (currentTime.isBefore(end) || currentTime.isSame(end)) {
        occupiedTimes.push(currentTime.format('HH:mm'));
        currentTime = currentTime.add(30, 'minute');
      }
    });
    return occupiedTimes;
  };

  const useDateSelect = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    console.log('Selected date changed:', formattedDate);
    sSelectedDate(date);
    sDepartureTime('');
    sLandingTime('');
  };

  const useDepartureTimeSelect = (time) => {
    const selected = availableDepartureTimes.find(({ time: t }) => t === time);
    if (selected.isOccupied) {
      alert('This departure time is already occupied.');
    } else {
      sDepartureTime(time);
    }
  };

  const useLandingTimeSelect = (time) => {
    const selected = availableLandingTimes.find(({ time: t }) => t === time);
    if (selected.isOccupied) {
      alert('This landing time is already occupied.');
    } else {
      sLandingTime(time);
    }
  };

  const sendFlightDetailsToServer = () => {
    const [startHour, startMinute] = departureTime.split(':');
    const [endHour, endMinute] = landingTime.split(':');
    const formattedDate = selectedDate?.format('YYYY-MM-DD') || '';
    if (!formattedDate) {
      console.error('Error: Date is not selected or is invalid.');
      sNotificationMessage('Error: Date is not selected or is invalid.');
      sNotificationOpen(true);
      return;
    }
    console.log('Day sent to the server:', selectedDate.date()); 
    console.log('Date sent to the server:', formattedDate); 

    const flightDetails = {
      messageNumber: 0,
      message: `Flight scheduled on ${selectedDate.format('DD-MM-YYYY')} from ${departureTime} to ${landingTime}`,
      licenseNumber: obj.licenseNumber,
      startHour: parseInt(startHour, 10),
      startMinute: parseInt(startMinute, 10),
      endHour: parseInt(endHour, 10),
      endMinute: parseInt(endMinute, 10),
      flightDate: formattedDate,
      licenseNumberNavigation: null
    };

    const jsonPayload = JSON.stringify(flightDetails);
    console.log('JSON sent to the server:', jsonPayload);

    fetch(sendMessageApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonPayload,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        if (text) {
          try {
            const data = JSON.parse(text);
            console.log('Response from server:', data);
          } catch (error) {
            console.log('Received non-JSON response:', text);
          }
        } else {
          console.log('Received an empty response from the server');
        }

        sNotificationMessage('Your request has been sent and is currently being reviewed.');
        sNotificationOpen(true);

      })
      .catch(error => {
        console.error('Error sending data to the server:', error);
        sNotificationMessage('There was an error sending your request. Please try again.');
        sNotificationOpen(true);
      });
  };

  const DoCloseNotification = () => {
    sNotificationOpen(false);
  };

  const occupiedTimes = getOccupiedTimesForDate(selectedDate);
  const availableDepartureTimes = filterTimes(departureTimes, occupiedTimes);
  const availableLandingTimes = filterTimes(landingTimes, occupiedTimes);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundSize: 'cover',
      backgroundImage: `url('homeimg.png')`,
      padding: '20px',
      boxSizing: 'border-box',
      textAlign: 'center'
    }}>
      <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>בחר טיסה</h1>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', width: '100%', maxWidth: '333px', marginBottom: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(date) => useDateSelect(date)}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{ day: ServerDay }}
            slotProps={{ day: { highlightedDays } }}
          />
        </LocalizationProvider>
      </div>
      <Select
        onChange={(e) => useDepartureTimeSelect(e.target.value)}
        name="departureTime"
        id="departureTime"
        sx={{
          backgroundColor: 'rgba(0, 51, 102, 0.2)',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '15px',
          color: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          maxWidth: '250px'
        }}
        value={departureTime}
        displayEmpty
      >
        <MenuItem value="">בחר שעת המראה</MenuItem>
        {availableDepartureTimes.map(({ time, isOccupied }) => (
          <MenuItem key={time} value={time} disabled={isOccupied}>
            <ListItemText primary={time} />
          </MenuItem>
        ))}
      </Select>
      <Select
        onChange={(e) => useLandingTimeSelect(e.target.value)}
        name="landingTime"
        id="landingTime"
        sx={{
          backgroundColor: 'rgba(0, 51, 102, 0.2)',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '15px',
          color: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          maxWidth: '250px'
        }}
        value={landingTime}
        displayEmpty
      >
        <MenuItem value="">בחר שעת נחיתה</MenuItem>
        {availableLandingTimes.map(({ time, isOccupied }) => (
          <MenuItem key={time} value={time} disabled={isOccupied}>
            <ListItemText primary={time} />
          </MenuItem>
        ))}
      </Select>
      <Button
        variant="contained"
        color="primary"
        onClick={sendFlightDetailsToServer}
        sx={{
          marginBottom: '20px',
          borderRadius: '20px',
          backgroundColor: 'white',
          color: 'purple',
          padding: '10px 30px',
          width: '100%',
          maxWidth: '300px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
          fontFamily: 'Arial, sans-serif',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#ccc',
          },
        }}
      >
        שלח נתוני טיסה
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate('/HomePage', { state: { obj } })}
        sx={{
          borderRadius: '20px',
          backgroundColor: 'white',
          color: 'purple',
          padding: '10px 30px',
          width: '100%',
          maxWidth: '300px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease',
          fontFamily: 'Arial, sans-serif',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#ccc',
          },
        }}
      >
        חזור אל דף הבית
      </Button>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={DoCloseNotification}
      >
        <Alert onClose={DoCloseNotification} severity="success" sx={{ width: '100%' }}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FindAFlight;
