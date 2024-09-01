import React, { useState, useEffect, useRef } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay, DayCalendarSkeleton } from '@mui/x-date-pickers';
import Badge from '@mui/material/Badge';
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import dayjs from 'dayjs';

const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/getallslots'; 

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  const isSelected = !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

function ServerHour(props) {
  const { highlightedHours = [], hour, ...other } = props;
  const isOccupied = highlightedHours.includes(hour);

  return (
    <option
      key={hour}
      value={hour}
      className={isOccupied ? 'occupied' : ''}
      {...other}
    >
      {hour}
    </option>
  );
}

const Order_a_flight = ({ productName, productDetails }) => {
  const OrderButtonClick = () => {
    const message = `שלום רב,\nאני מעוניין להזמין השכרת טיסה:\n${productDetails}`;
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <Button className='order-this-product' onClick={OrderButtonClick} style={{ borderRadius: '20px', backgroundColor: 'white', color: 'green' }}>הזן והמשך</Button>
  );
};

const FindAFlight = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [highlightedHours, setHighlightedHours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [error, setError] = useState(null); // State to hold API fetch error
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state?.obj || '';
  const requestAbortController = useRef(null);

  // Fetch occupied slots from API
  useEffect(() => {
    fetchOccupiedSlots();
    return () => requestAbortController.current?.abort();
  }, []);

  // Fetch occupied slots function
  const fetchOccupiedSlots = () => {
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch occupied slots');
        }
        return response.json();
      })
      .then(data => {
        const slots = data.map(slot => ({
          date: dayjs(slot.date),
          hour: slot.hour
        }));
        setOccupiedSlots(slots);
      })
      .catch(error => {
        console.error('Error fetching occupied slots:', error);
        setError(error.message);
      });
  };

  // Fetch highlighted days for the current month
  const fetchHighlightedDays = (date) => {
    setIsLoading(true);
    const controller = new AbortController();
    fakeFetch(date, { signal: controller.signal })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching highlighted days:', error);
          setIsLoading(false);
        }
      });
    requestAbortController.current = controller;
  };

  // Fetch highlighted hours for the selected date
  const fetchHighlightedHours = (date) => {
    setIsLoading(true);
    const controller = new AbortController();
    fakeFetch(date, { signal: controller.signal })
      .then(({ hoursToHighlight }) => {
        setHighlightedHours(hoursToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching highlighted hours:', error);
          setIsLoading(false);
        }
      });
    requestAbortController.current = controller;
  };

  // Mock function for fetching highlighted days and hours
  function fakeFetch(date, options) {
    return new Promise((resolve, reject) => {
      // Simulated response with highlighted days and hours for the current month/date
      const daysToHighlight = [1, 5, 10]; // Example: Replace with your logic to determine highlighted days
      const hoursToHighlight = ['01:00-01:30', '02:00-02:30']; // Example: Replace with your logic to determine highlighted hours
      resolve({ daysToHighlight, hoursToHighlight });
    });
  }

  // Handle month change in date calendar
  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }
    setIsLoading(true);
    setHighlightedDays([]);
    setHighlightedHours([]);
    fetchHighlightedDays(date);
  };

  // Handle date selection in calendar
  const handleDateSelect = (date) => {
    const formattedDate = `${date.date()}.${date.month() + 1}.${date.year()}`;
    setSelectedDate(formattedDate);
    fetchHighlightedHours(date); // Fetch highlighted hours for the selected date
  };

  // Handle hour selection
  const handleHourSelect = (hourRange) => {
    const occupied = occupiedSlots.some(slot => {
      const slotStart = slot.hour;
      const slotEnd = add30Minutes(slot.hour); // Assuming a function to add 30 minutes to the slot start time
  
      // Check if selected hourRange overlaps with occupied slot
      const [selectedStart, selectedEnd] = hourRange.split('-');
      return doTimeRangesOverlap(slotStart, slotEnd, selectedStart, selectedEnd);
    });
  
    if (occupied) {
      alert('השעה הנבחרת כבר תפוסה. אנא בחר שעה אחרת.');
    } else {
      // Proceed with hour selection logic here
    }
  };


  return (
    <div style={{ textAlign: 'center', backgroundImage: 'url("src/Pages/imgs/homeimg.png")' }}>
      <h1>בחר טיסה</h1>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', margin: '18px', padding: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={(e) => {
              const date = e.$D + "." + (e.$M + 1) + "." + e.$y;
              handleDateSelect(dayjs(date));
            }}
            onMonthChange={handleMonthChange}
            loading={isLoading}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay,
            }}
            slotProps={{
              day: {
                highlightedDays,
              },
            }}
            className='Date-selection'
            type="date"
            placeholder="dd-mm-yyyy"
            min="1997-01-01"
            max="2030-12-31"
          />
        </LocalizationProvider>
      </div>
      <div>
        <select
          onChange={(e) => handleHourSelect(e.target.value)}
          name="fromtimretotime"
          id="fromtimretotime"
          style={{
            backgroundColor: 'rgba(0, 51, 102, 0.2)',
            borderRadius: '10px',
            margin: '23px',
            padding: '20px',
            fontSize: '15px',
            color: 'rgba(0, 0, 0, 0.6)',
          }}
        >
          <option value="בחר שעה">בחר שעה</option>
          {['00:00-00:30', '00:30-01:00', '01:00-01:30', /* add all options */].map((hour) => (
            <ServerHour
              key={hour}
              hour={hour}
              highlightedHours={highlightedHours}
              className={highlightedHours.includes(hour) ? 'occupied' : ''}
            />
          ))}
        </select>

      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div style={{ alignItems: 'center' }}>
        <br />
        <button
          variant="contained"
          color="primary"
          onClick={() => navigate('/HomePage', { state: { obj } })}
          style={{ marginRight: '5px', borderRadius: '20px', backgroundColor: 'white', color: 'purple' }}
        >
          חזור אל דף הבית
        </button>
      </div>
      <br />
      <Order_a_flight productName="טיסה" productDetails={`לתאריך: ${selectedDate}\nשמי ${obj.firstName} ${obj.lastName}\nמספר הרישיון שלי: ${obj.licenseNumber}\nוהמספר שלי לטלפון: ${obj.phoneNumber}`} />
    </div>
  );
};

const occupied = {
  color: 'red',
  // background-color: 'lightgray',
  // pointer-events: 'none',
  }

export default FindAFlight;

//בחירת שעה שישאר להמשך
//       <div>
//<h4>שעת התחלה</h4>
//<LocalizationProvider dateAdapter={AdapterDayjs}>
// <DigitalClock value={startTime} onChange={StartTimeChange} className='Select-a-start-time' />
//</LocalizationProvider>
//</div>
//<div style={{ marginLeft: '10px' }}>
//<h4 >שעת סיום</h4>
//<LocalizationProvider dateAdapter={AdapterDayjs}>
//<DigitalClock value={endTime} onChange={EndTimeChange} className='End-time-selection' />
//</LocalizationProvider>
//</div>

//<div style={{ display: 'flex', justifyContent: 'center' }}> {/* Adjusted container */}
//      <div style={{ marginRight: '10px' }}> {/* Start time container */}
//      <h4>שעת התחלה</h4>
//    <LocalizationProvider dateAdapter={AdapterDayjs}>
//    <DigitalClock onChange={(e) => {
//    let minutes = "";
//  (e.$m == 0) ? minutes = "00" : minutes = e.$m;
//let hours = "";
// (e.$H < 10) ? hours = "0" + e.$H : hours = e.$H;
//const time = hours + ":" + minutes;
//StartTime(time);
// }} className='Select-a-start-time' />
// </LocalizationProvider>
//</div>
/// <div>
// <h4 >שעת סיום</h4>
// <LocalizationProvider dateAdapter={AdapterDayjs}>
// <DigitalClock onChange={(e) => {
// let minutes = "";
// (e.$m == 0) ? minutes = "00" : minutes = e.$m;
// let hours = "";
// (e.$H < 10) ? hours = "0" + e.$H : hours = e.$H;
// const time = hours + ":" + minutes;
//  EndTime(time);
// }} className='End-time-selection' />
// </LocalizationProvider>
// </div>
// </div>