import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";

const ExpiredRecordsForPilots = () => {
    const [expiredRecords, sExpiredRecords] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const obj = location.state?.obj || '';

    useEffect(() => {
        const fetchPilots = async () => {
            try {
                const response = await fetch('https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/pilots/viewallpilots');
                console.log('Response:', response);
                const pilots = await response.json();
                console.log('Pilots:', pilots);
                const today = dayjs();
                const expiredRecordsArray = [];

                pilots.forEach((pilot) => {
                    const medicalCertExpiryDate = dayjs(pilot.medicalExpiry);
                    const levelTestExpiryDate = dayjs(pilot.mivhanRama);
                    if (medicalCertExpiryDate.isBefore(today) || levelTestExpiryDate.isBefore(today)) {
                        expiredRecordsArray.push({
                            licenseNumber: pilot.licenseNumber,
                            medicalCertExpiryDate: medicalCertExpiryDate.isBefore(today) ? medicalCertExpiryDate.format('YYYY.MM.DD') : 'תקין',
                            levelTestExpiryDate: levelTestExpiryDate.isBefore(today) ? levelTestExpiryDate.format('YYYY.MM.DD') : 'תקין',
                            phoneNumber: pilot.phoneNumber || 'מספר טלפון חסר',
                        });
                    }
                });
                sExpiredRecords(expiredRecordsArray);
            } catch (error) {
                console.error('Error fetching pilot data:', error);
            }
        };
        fetchPilots();
    }, []);

    const goback = (obj) => {
        navigate('/HomePageEm', { state: { obj } });
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
            <h1 style={{ fontFamily: 'Arial, sans-serif', marginBottom: '20px' }}><b>תקפי רישיונות </b></h1>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => goback(obj)}
                sx={{
                    borderRadius: '20px',
                    backgroundColor: 'white',
                    color: '#4682B4',
                    padding: '10px 30px',
                    marginBottom: '20px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: '2px solid #4682B4',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    outline: 'none',
                    maxWidth: '300px',
                    '&:hover': {
                        backgroundColor: '#4682B4',
                        color: 'black'
                    },
                }}
            >
                חזור אל דף הבית
            </Button>
            <TableContainer component={Paper} sx={{
                margin: '0 auto',
                borderCollapse: 'collapse',
                color: 'white',
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
                                backgroundColor: '#4682B4',
                                color: 'white',
                                border: '1px solid #4682B4',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>מספר רישיון</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#4682B4',
                                color: 'white',
                                border: '1px solid #4682B4',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>פג תוקף תעודה רפואית בתאריך</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#4682B4',
                                color: 'white',
                                border: '1px solid #4682B4',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>פג תוקף מבחן רמה בתאריך</TableCell>
                            <TableCell sx={{
                                padding: '10px',
                                backgroundColor: '#4682B4',
                                color: 'white',
                                border: '1px solid #4682B4',
                                fontFamily: 'Arial, sans-serif',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textAlign: 'center',
                                verticalAlign: 'middle',
                            }}>מספר טלפון</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {expiredRecords.map((record, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #4682B4',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{record.licenseNumber}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #4682B4',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{record.medicalCertExpiryDate}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #4682B4',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{record.levelTestExpiryDate}</TableCell>
                                <TableCell sx={{
                                    padding: '10px',
                                    border: '1px solid #4682B4',
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                }}>{record.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ExpiredRecordsForPilots;
