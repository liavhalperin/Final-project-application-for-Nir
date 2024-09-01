import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import dayjs from 'dayjs';

const getRequestsApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Messages/getrequests';
const addSlotApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Slots/addslot';
const deleteRequestApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/Messages/deletemessage';

const Schedule_a_new_flight = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const obj = location.state?.obj || '';
    const GotoHomePage = () => {
        navigate('/HomePageEm', { state: { obj } });
    };

    const [requests, ssRequests] = useState([]);
    const [selectedRequest, ssSelectedRequest] = useState(null);
    const [notificationOpen, ssNotificationOpen] = useState(false);
    const [notificationMessage, ssNotificationMessage] = useState('');
    const [confirmRejectOpen, ssConfirmRejectOpen] = useState(false);

    useEffect(() => {
        console.log('Fetching requests from:', getRequestsApiUrl);
        fetch(getRequestsApiUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log('Raw data received:', data);
                if (data.length > 0 && data[0].flightDate === undefined) {
                    console.error('flightDate is missing in the received data');
                }
                const validRequests = data.filter(request =>
                    request.licenseNumber !== null &&
                    request.startHour !== null &&
                    request.startMinute !== null &&
                    request.endHour !== null &&
                    request.endMinute !== null &&
                    request.flightDate !== null
                );
                console.log('Valid requests after filtering:', validRequests);
                ssRequests(validRequests);
            })
            .catch(error => console.error('Error fetching requests:', error));
    }, []);

    const doApprove = (request) => {
        console.log('Selected Request for approval:', request);
        console.log('Selected date for approval:', request.flightDate);

        const slot = {
            pilotLicenseNumber: request.licenseNumber,
            flightDate: request.flightDate,
            departTime: `${request.startHour.toString().padStart(2, '0')}:${request.startMinute.toString().padStart(2, '0')}:00`,
            landingTime: `${request.endHour.toString().padStart(2, '0')}:${request.endMinute.toString().padStart(2, '0')}:00`,
            StartHOBBS: `${request.startHour + request.startMinute / 60}`,
            EndHOBBS: `${request.endHour + request.endMinute / 60}`,
            TotalHOBBS: request.endHour - request.startHour,
        };

        console.log('Slot data being sent to the server:', slot);
        const newPost = addSlotApiUrl + '?DHour=' + request.startHour + '&DMinute=' + request.startMinute +
            '&LHour=' + request.endHour + '&LMinute=' + request.endMinute;
        fetch(newPost, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(slot),
        })
            .then(response => {
                console.log('Response from addSlot API:', response);
                if (!response.ok) {
                    ssNotificationMessage('Some of the data was sent properly, the rest must be updated manually.');
                    return response.text().then(text => { throw new Error(`Server error: ${response.status}, ${text}`); });
                }
                return response.text();
            })
            .then(text => {
                console.log('Response text from addSlot API:', text);
                ssNotificationMessage('Request approved successfully.');
            
                const deleteUrl = `${deleteRequestApiUrl}/${request.messageNumber}`;
                console.log('DELETE URL:', deleteUrl, 'Message Number:', request.messageNumber); // Add this line
                fetch(deleteUrl, { method: 'DELETE' })
                    .then(response => {
                        console.log('Response from deleteRequest API:', response);
                        if (!response.ok) {
                            ssNotificationMessage('Some of the data was sent properly, the rest must be updated manually.');
                        } else {
                            ssRequests(prevRequests => prevRequests.filter(r => r.messageNumber !== request.messageNumber));
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting request:', error);
                        ssNotificationMessage('Some of the data was sent properly, the rest must be updated manually.');
                    });
            
                ssSelectedRequest(null);
                ssNotificationOpen(true);
            })
            ;
    };

    const doReject = (request) => {
        console.log('Request selected for rejection:', request);
        ssSelectedRequest(request);
        ssConfirmRejectOpen(true);
    };

    const confirmReject = () => {
        if (!selectedRequest) {
            console.error('No request selected for rejection');
            return;
        }

        const request = selectedRequest;
        console.log('Confirming rejection for request:', request);

        const deleteUrl = `${deleteRequestApiUrl}/${request.messageNumber}`;
        console.log('DELETE URL for rejection:', deleteUrl);

        fetch(deleteUrl, { method: 'DELETE' })
            .then(response => {
                console.log('Response from deleteRequest API during rejection:', response);
                if (!response.ok) throw new Error('Failed to delete the request.');
                ssRequests(prevRequests => prevRequests.filter(r => r.messageNumber !== request.messageNumber));
            })
            .catch(error => console.error('Error deleting request during rejection:', error));

        ssSelectedRequest(null);
        ssConfirmRejectOpen(false);
    };

    const cancelReject = () => {
        console.log('Canceling rejection');
        ssConfirmRejectOpen(false);
        ssSelectedRequest(null);
    };

    const doRequestSelect = (request) => {
        console.log('Request selected:', request);
        ssSelectedRequest(request);
    };

    const formatTime = (hour, minute) => {
        if (hour == null || minute == null) return 'N/A';
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        return formattedTime;
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
                <h1>בקשות לקביעת טיסה</h1>
                <button onClick={GotoHomePage} style={buttonStyle}>חזור</button>
                <br /><br />
                {requests.map((request, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: selectedRequest === request ? 'linear-gradient(145deg, #1e90ff, #87cefa)' : 'rgba(255, 255, 255, 0.2)',
                            padding: '10px',
                            borderRadius: '9px',
                            marginBottom: '10px',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                        onClick={() => doRequestSelect(request)}
                    >
                        <p>מספר בקשה: {request.messageNumber}</p>
                        <p>מספר רישיון: {request.licenseNumber}</p>
                        <p>תאריך טיסה: {dayjs(request.flightDate).format('DD/MM/YYYY')}</p>
                        <p>שעת המראה: {formatTime(request.startHour, request.startMinute)}</p>
                        <p>שעת נחיתה: {formatTime(request.endHour, request.endMinute)}</p>
                        {selectedRequest === request && (
                            <div style={{ marginTop: '10px' }}>
                                <button onClick={() => doApprove(request)} style={buttonStyle}>אישור</button>
                                <button onClick={() => doReject(request)} style={buttonStyle}>דחייה</button>
                            </div>
                        )}
                    </div>
                ))}

                <Snackbar open={notificationOpen} autoHideDuration={6000} onClose={() => ssNotificationOpen(false)}>
                    <Alert onClose={() => ssNotificationOpen(false)} severity="success" sx={{ width: '100%' }}>{notificationMessage}</Alert>
                </Snackbar>

                <Dialog open={confirmRejectOpen} onClose={cancelReject}>
                    <DialogTitle>אשר דחייה</DialogTitle>
                    <DialogContent>
                        <DialogContentText>? האם אתה בטוח שברצונך לדחות בקשה זו</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelReject}>No</Button>
                        <Button onClick={confirmReject} color="error">Yes</Button>
                    </DialogActions>
                </Dialog>
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

export default Schedule_a_new_flight;
