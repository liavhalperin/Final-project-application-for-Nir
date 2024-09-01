import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';

export default function Weather() {
    const [fields, updateFields] = useState(null);
    const [selectedField, chooseField] = useState(null);
    const [weather, updateWeather] = useState(null);
    const [selectedDay, chooseDay] = useState(null);
    const location = useLocation();
    const obj = location.state?.obj || '';
    const navigate = useNavigate();

    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Fields/getfield';

    const GoBack = () => {
        navigate('/HomePage', { state: { obj } });
    };

    useEffect(() => {
        fetch(apiUrl)
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(result => {
                console.log("fetch result: ", result);
                updateFields(result);
            })
            .catch(error => {
                console.log("Fetch error: ", error);
                alert('Fetching data failed');
            });
    }, []);

    const FieldList = () => {
        if (!fields) return <p>Loading...</p>;
        return (
            <FormControl component="fieldset">
                <FormLabel component="legend" style={{ marginBottom: '10px', color: 'white' }}>בחר שדה תעופה</FormLabel>
                <RadioGroup
                    aria-label="fields"
                    name="fields"
                    value={selectedField?.fieldName || ''}
                    onChange={(e) => {
                        const selected = fields.find(field => field.fieldName === e.target.value);
                        chooseField(selected);
                    }}
                >
                    {fields
                        .filter(field => field.fieldName !== "Default")
                        .map(field => (
                            <FormControlLabel
                                key={field.icao}
                                value={field.fieldName}
                                control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} />}
                                label={<span style={{ color: 'white' }}>{field.fieldName}</span>} // Changed text color to white
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
        );
    };

    const fetchWeatherData = () => {
        if (selectedField) {
            const { longitude, latitude } = selectedField;
            const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

            fetch(weatherApiUrl)
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(weatherResult => {
                    console.log("weather fetch result: ", weatherResult);
                    updateWeather(weatherResult);
                })
                .catch(error => {
                    console.log("Weather fetch error: ", error);
                    alert('Fetching weather data failed');
                });
        } else {
            alert('Please select a field first');
        }
    };

    const adjustTime = (time) => {
        const date = new Date(time);
        date.setHours(date.getHours() + 6);
        return date.toTimeString().slice(0, 5); // HH:MM
    };

    const splitWeatherData = (weather) => {
        const today = [];
        const tomorrow = [];
        const dayAfterTomorrow = [];
        const currentDate = new Date();
        const todayStr = currentDate.toISOString().slice(0, 10);
        const tomorrowDate = new Date(currentDate);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrowStr = tomorrowDate.toISOString().slice(0, 10);
        const dayAfterTomorrowDate = new Date(currentDate);
        dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
        const dayAfterTomorrowStr = dayAfterTomorrowDate.toISOString().slice(0, 10);

        const validHours = ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00'];

        weather.hourly.time.forEach((time, index) => {
            const currentHour = new Date(time).getHours();
            const currentTime = adjustTime(time);
            if (time.startsWith(todayStr) && validHours.includes(currentTime)) {
                today.push(index);
            } else if (time.startsWith(tomorrowStr) && validHours.includes(currentTime)) {
                tomorrow.push(index);
            } else if (time.startsWith(dayAfterTomorrowStr) && validHours.includes(currentTime)) {
                dayAfterTomorrow.push(index);
            }
        });
        return { today, tomorrow, dayAfterTomorrow };
    };

    const renderWeatherTable = (weather, indices, dayLabel) => {
        return (
            <div>
                <h3>{dayLabel}</h3>
                <table style={{ borderRadius: '15px', margin: '0 auto', borderCollapse: 'collapse', width: '100%', maxWidth: '555px', overflow: 'hidden', outline: '1px solid #0066b2' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', backgroundColor: '#4682B4', color: 'white', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', verticalAlign: 'middle' }}>עוצמת רוח (knots)</th>
                            <th style={{ padding: '10px', backgroundColor: '#4682B4', color: 'white', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', verticalAlign: 'middle' }}>טמפרטורה</th>
                            <th style={{ padding: '10px', backgroundColor: '#4682B4', color: 'white', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '15px', textAlign: 'center', verticalAlign: 'middle' }}>שעה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indices.map(index => (
                            <tr key={index}>
                                <td style={{ padding: '10px', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle', color:'white' }}>{(weather.hourly.wind_speed_10m[index] * 0.539956803).toFixed(2)}</td>
                                <td style={{ padding: '10px', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle', color:'white' }}>{weather.hourly.temperature_2m[index]}°C</td>
                                <td style={{ padding: '10px', border: '1px solid #4682B4', fontFamily: 'Arial, sans-serif', fontSize: '14px', textAlign: 'center', verticalAlign: 'middle', color:'white' }}>{adjustTime(weather.hourly.time[index])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundSize: 'cover',
            backgroundImage: `url('homeimg.png')`,
            padding: '20px',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>בדיקת מז"א</h1>
                <FieldList />
                <br />
                <br />
                <Button
                    variant="contained"
                    onClick={fetchWeatherData}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#4caf50',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                        width: '100%',
                        maxWidth: '300px'
                    }}
                >
                    הצג מזג אוויר
                </Button>
                <Button
                    variant="contained"
                    onClick={GoBack}
                    sx={{
                        marginBottom: '20px',
                        backgroundColor: 'white',
                        color: '#4caf50',
                        fontWeight: 'bold',
                        borderRadius: '20px',
                        padding: '10px 30px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'background-color 0.3s ease',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#ccc',
                        },
                        width: '100%',
                        maxWidth: '300px'
                    }}
                >
                    חזור
                </Button>
                {weather && (
                    <div>
                        <h2>מזג אוויר נוכחי</h2>
                        <p> {weather.current_weather.temperature}°C :טמפרטורה</p>
                        <p> {(weather.current_weather.windspeed * 0.539956803).toFixed(2)} knots :עוצמת רוח</p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={() => chooseDay('today')}
                                sx={{
                                    marginBottom: '10px',
                                    backgroundColor: 'white',
                                    color: '#4caf50',
                                    fontWeight: 'bold',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',
                                    fontFamily: 'Arial, sans-serif',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#ccc',
                                    },
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                מזג האויר - היום
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => chooseDay('tomorrow')}
                                sx={{
                                    marginBottom: '10px',
                                    backgroundColor: 'white',
                                    color: '#4caf50',
                                    fontWeight: 'bold',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',
                                    fontFamily: 'Arial, sans-serif',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#ccc',
                                    },
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                מזג האויר - מחר
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => chooseDay('dayAfterTomorrow')}
                                sx={{
                                    marginBottom: '10px',
                                    backgroundColor: 'white',
                                    color: '#4caf50',
                                    fontWeight: 'bold',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                                    transition: 'background-color 0.3s ease',
                                    fontFamily: 'Arial, sans-serif',
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: '#ccc',
                                    },
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            >
                                מזג האויר - מחרתיים
                            </Button>
                        </div>
                        {(() => {
                            const { today, tomorrow, dayAfterTomorrow } = splitWeatherData(weather);
                            if (selectedDay === 'today') {
                                return renderWeatherTable(weather, today, "מזג האויר - היום");
                            } else if (selectedDay === 'tomorrow') {
                                return renderWeatherTable(weather, tomorrow, "מזג האויר - מחר");
                            } else if (selectedDay === 'dayAfterTomorrow') {
                                return renderWeatherTable(weather, dayAfterTomorrow, "מזג האויר - מחרתיים");
                            }
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
