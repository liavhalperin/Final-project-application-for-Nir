import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";

const CommunicationWithPilots = () => {
    const navigate = useNavigate();
    const [ageRange, sAgeRange] = useState(20); // default age to 20
    const [purposeFilter, SPurposeFilter] = useState('');
    const [pilotsList, SPilotsList] = useState([]);
    const location = useLocation();
    const obj = location.state?.obj || '';

    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/pilots/viewallpilots';

    const goback = (obj) => {
        navigate('/HomePage', { state: { obj } });
    };

    const fetchData = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            SPilotsList(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredList = pilotsList.filter((pilot) => {
        const ageFilter = ageRange === 0 || pilot.age1 >= ageRange;
        const purposeFilterMatch =
            purposeFilter === '' || 
            (purposeFilter === 'שדה זה ריק' && pilot.interestedInFlightTypes.length === 0) ||
            pilot.interestedInFlightTypes.some((flightType) =>
                purposeFilter === 'שדה זה ריק'
                    ? !flightType.flightTypeNavigation.type 
                    : flightType.flightTypeNavigation.type === purposeFilter
            );

        return ageFilter && purposeFilterMatch;
    });

    const AgeRange = (event) => {
        sAgeRange(parseInt(event.target.value, 10));
    };

    return (
        <div dir="rtl" style={{
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
            <h1 style={{ fontFamily: 'Arial, sans-serif', marginBottom: '20px' }}><b>תקשורת עם טייסים</b></h1>
            <label style={{ color: 'white', fontFamily: 'Arial, sans-serif', fontSize: '18px', marginBottom: '20px' }} htmlFor="vol">
                הצג טייסים מגיל: <span style={{ color: 'white', fontSize: '18px' }}>{ageRange}</span>
            </label>
            <input type="range" id="vol" min="16" max="50" value={ageRange} onChange={AgeRange} style={{ marginBottom: '20px', width: '100%', maxWidth: '200px' }} />
            <select
                value={purposeFilter}
                onChange={(e) => SPurposeFilter(e.target.value)}
                style={{ marginBottom: '20px', width: '100%', maxWidth: '200px' }}
            >
                <option value="">סינון לפי מטרת טיסה</option>
                <option value="אימונים">אימונים</option>
                <option value="חוויה">חוויה</option>
                <option value="צבירת שעות">צבירת שעות</option>
                <option value="שדה זה ריק">שדה זה ריק</option> 
            </select>
            <TableContainer component={Paper} sx={{
                margin: '0 auto',
                borderCollapse: 'collapse',
                width: '100%',
                maxWidth: '555px',
                borderRadius: '15px',
                overflow: 'hidden',
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#5072A7',
                                color: 'white',
                                border: '1px solid #5072A7',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>שם פרטי</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#5072A7',
                                color: 'white',
                                border: '1px solid #5072A7',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>שם משפחה</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#5072A7',
                                color: 'white',
                                border: '1px solid #5072A7',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>מטרת טיסה</TableCell>
                             <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#5072A7',
                                color: 'white',
                                border: '1px solid #5072A7',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}> גיל</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#5072A7',
                                color: 'white',
                                border: '1px solid #5072A7',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>מספר טלפון</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredList.map((pilot, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #5072A7',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{pilot.firstName}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #5072A7',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{pilot.lastName}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #5072A7',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>
                                    {pilot.interestedInFlightTypes.length === 0 ? (
                                        <div>שדה זה ריק</div>
                                    ) : (
                                        pilot.interestedInFlightTypes.map((flightType, idx) => (
                                            <div key={idx}>{flightType.flightTypeNavigation.type}</div>
                                        ))
                                    )}
                                </TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #5072A7',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{pilot.age1}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #5072A7',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{pilot.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <Button
                variant="contained"
                color="secondary"
                onClick={() => goback(obj)}
                sx={{
                    borderRadius: '20px',
                    backgroundColor: 'white',
                    color: '#5072A7',
                    padding: '10px 30px',
                    marginBottom: '20px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: '2px solid #5072A7',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    outline: 'none',
                    maxWidth: '300px',
                    '&:hover': {
                        backgroundColor: '#5072A7',
                        color: 'black'
                    },
                }}
            >
                חזור
            </Button>
        </div>
    );
};

export default CommunicationWithPilots;
