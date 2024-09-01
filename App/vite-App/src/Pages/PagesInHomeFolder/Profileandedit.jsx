import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Snackbar, Alert } from '@mui/material';

const UploadProfileImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadProfileImage';
const UploadProfileDetails = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Pilots/UpdatePilot';

const Profileandedit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const obj = location.state?.obj || {};
    const [pilotDetails, sPilotDetails] = useState(obj);
    const [profileImage, sProfileImage] = useState(null);
    const [snackbarOpen, sSnackbarOpen] = useState(false);
    const [snackbarMessage, sSnackbarMessage] = useState('');
    const [snackbarSeverity, sSnackbarSeverity] = useState('success'); // 'success' or 'error'

    useEffect(() => {
        if (obj) {
            sPilotDetails(obj);
            console.log("Pilot details from location state:", obj);
        } else {
            console.error('No pilot details found in location state.');
        }
    }, [obj]);

    const Goto = (obj) => {
        console.log("Navigating to HomePage with object:", obj);
        navigate('/HomePage', { state: { obj } });
    };

    const doInputChange = (field, value) => {
        let updatedDetails = { ...pilotDetails, [field]: value };
        console.log(`Updating ${field} to:`, value);
        sPilotDetails(updatedDetails);
        console.log(`Updated field ${field}:`, updatedDetails);
    };

    const ToFileChange = (e) => {
        console.log("File selected:", e.target.files[0]);
        sProfileImage(e.target.files[0]);
    };

    const Forsave = async (event) => {
        event.preventDefault();
        try {
            console.log("Sending request to update pilot details:", pilotDetails);

            const response = await fetch(`${UploadProfileDetails}?LicenseNum=${pilotDetails.licenseNumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pilotDetails)
            });
            console.log("Response from update pilot details:", response);

            if (!response.ok) {
                const errorDetails = await response.text();
                console.error('Error details:', errorDetails);
                throw new Error(`Failed to update pilot details: ${response.statusText} (${response.status})`);
            }

            if (profileImage) {
                console.log("Profile image found, uploading...");
                await uploadFile(profileImage, UploadProfileImage, pilotDetails.licenseNumber);
                console.log("Profile image uploaded successfully");
            }

            sSnackbarMessage('Details updated successfully');
            sSnackbarSeverity('success');
        } catch (error) {
            console.error('Error updating pilot details:', error);
            sSnackbarMessage('Failed to update pilot details. Please try again.');
            sSnackbarSeverity('error');
        } finally {
            sSnackbarOpen(true);
        }
    };

    const uploadFile = async (file, url, licenseNumber) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('LicenseNumber', licenseNumber);

        try {
            console.log("Uploading file:", file.name);
            const response = await fetch(url, { method: 'POST', body: formData });
            console.log("Response from file upload:", response);
            if (!response.ok) {
                throw new Error(`Failed to upload ${file.name}`);
            }
            const responseData = await response.json();
            console.log("File upload response data:", responseData);
            return responseData;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload the file. Please try again.');
        }
    };

    const SnackbarClose = () => {
        sSnackbarOpen(false);
    };

    const formatFieldName = (field) => {
        const fieldNames = {
            licenseNumber: "מספר רישיון",
            id: "מספר תעודת זהות",
            firstName: "שם פרטי",
            lastName: "שם משפחה",
            dateOfBirth: "תאריך לידה",
            phoneNumber: "מספר טלפון",
            validityDateOfLevelTest: "תוקף מבחן רמה",
            validityDateOfMedicalCertificate: "תוקף תעודה רפואית",
        };
        return fieldNames[field] || field;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'center',
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
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>פרופיל הטייס</h1>
                <h6 style={{ fontFamily: 'Arial, sans-serif' }}>
                    ניתנת אפשרות לערוך את מספר הטלפון, תוקף מבחן רמה ותוקף תעודה רפואית
                    <br />
                    לאחר שמירת השינויים יש להתנתק ולהתחבר מחדש על מנת לראות את השינויים שבוצעו.
                </h6>
                <form onSubmit={Forsave}>
                    {['licenseNumber', 'id', 'firstName', 'lastName', 'dob'].map((field, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 5px 0', fontFamily: 'Arial, sans-serif' }}>{formatFieldName(field)}</p>
                            <input
                                style={inputStyle}
                                type={field === 'dob' ? 'date' : 'text'}
                                value={
                                    field === 'dob'
                                        ? pilotDetails.dob ? new Date(pilotDetails.dob).toISOString().split('T')[0] : ''
                                        : pilotDetails[field] || 'אין נתונים'
                                }
                                readOnly
                                dir="rtl"
                            />
                        </div>
                    ))}
                    {['phoneNumber', 'mivhanRama', 'medicalExpiry'].map((field, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <p style={{ margin: '0 0 5px 0', fontFamily: 'Arial, sans-serif' }}>{formatFieldName(field)}</p>
                            <input
                                style={inputStyle}
                                type={(field === 'mivhanRama' || field === 'medicalExpiry') ? 'date' : 'text'}
                                value={
                                    (field === 'mivhanRama' || field === 'medicalExpiry')
                                        ? pilotDetails[field]
                                            ? (() => {
                                                const date = new Date(pilotDetails[field]);
                                                date.setDate(date.getDate());
                                                return date.toISOString().split('T')[0];
                                            })()
                                            : ''
                                        : pilotDetails[field] || ''
                                }
                                onChange={(e) => doInputChange(field, e.target.value)}
                                dir="rtl"
                            />
                        </div>
                    ))}
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 5px 0', fontFamily: 'Arial, sans-serif' }}>תמונת פרופיל</p>
                        <label htmlFor="file-upload" style={customFileInputStyle}>
                            בחר קובץ
                        </label>
                        <input 
                            id="file-upload" 
                            type="file" 
                            onChange={ToFileChange} 
                            style={{ display: 'none' }} 
                        />
                        {profileImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{profileImage.name}</p>}
                    </div> 
                    <button type="submit" style={buttonStyle}>שמור שינויים</button>
                    <br />
                    <br />
                    <button type="button" onClick={() => Goto(obj)} style={buttonStyle}>חזור</button>
                </form>
            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={SnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={SnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    maxWidth: '300px', 
    minWidth: '200px', 
    borderRadius: '20px',
    fontFamily: 'Arial, sans-serif',
    color: 'black',
    backgroundColor: 'white',
    padding: '10px',
    boxSizing: 'border-box',
    textAlign: 'right'
};

const customFileInputStyle = {
    display: 'inline-block',
    borderRadius: '20px',
    backgroundColor: 'white',
    color: '#5072A7',
    padding: '10px 20px',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold',
    border: '2px solid #7CB9E8',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    outline: 'none',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    fontSize: '12.5px',
};

const buttonStyle = {
    borderRadius: '20px',
    backgroundColor: 'white',
    color: 'blue',
    padding: '10px 30px',
    width: '100%',
    maxWidth: '300px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    border: '2px solid blue',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    outline: 'none',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    textAlign: 'center'
};

export default Profileandedit;
