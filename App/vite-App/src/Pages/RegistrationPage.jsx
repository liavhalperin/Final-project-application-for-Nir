import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const addpilot = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Pilots/addpilot';

const UploadProfileImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadProfileImage';
const UploadLicesneImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadLicenseImage';
const UploadIDImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadIDImage';
const UploadMedicalImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadMedicalImage';
const UploadivhanRamaImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadMivhanRamaImage';
const UploadLogbookImage = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/FileUpload/UploadLogbookImage';

const RegistrationPage = () => {
  const [licenseNumber, sLicenseNumber] = useState('');
  const [id, sID] = useState('');
  const [firstName, sFirstName] = useState('');
  const [lastName, sLastName] = useState('');
  const [phoneNumber, sPhoneNumber] = useState('');
  const [dateOfBirth, sDateOfBirth] = useState('');
  const [validityDateOfMedicalCertificate, sValidityDateOfMedicalCertificate] = useState('');
  const [validityDateOfLevelTest, sValidityDateOfLevelTest] = useState('');

  const [profileImage, sProfileImage] = useState(null);
  const [licenseImage, sLicenseImage] = useState(null);
  const [idImage, sIdImage] = useState(null);
  const [medicalImage, sMedicalImage] = useState(null);
  const [mivhanRamaImage, sMivhanRamaImage] = useState(null);
  const [logbookImage, sLogbookImage] = useState(null);

  const navigate = useNavigate();

  const Completedandmovingon = () => {
    console.log('Registration completed successfully');
    navigate('/LoginPage', { state: "You have successfully registered" });
  };

  const IFFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const uploadFile = async (file, url, licenseNumber) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('LicenseNumber', licenseNumber);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload the file. Please try again.');
    }
  };

  const IfSubmit = async (e) => {
    e.preventDefault();

    const data = {
      LicenseNumber: parseInt(licenseNumber, 10),
      ID: id,
      FirstName: firstName,
      LastName: lastName,
      Dob: dateOfBirth,
      PhoneNumber: phoneNumber,
      MedicalExpiry: validityDateOfMedicalCertificate,
      MivhanRama: validityDateOfLevelTest
    };

    try {
      const response = await fetch(addpilot, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = (await response.headers.get('content-length')) > 0 ? await response.json() : {};

      if (profileImage) await uploadFile(profileImage, UploadProfileImage, data.LicenseNumber);
      if (licenseImage) await uploadFile(licenseImage, UploadLicesneImage, data.LicenseNumber);
      if (idImage) await uploadFile(idImage, UploadIDImage, data.LicenseNumber);
      if (medicalImage) await uploadFile(medicalImage, UploadMedicalImage, data.LicenseNumber);
      if (mivhanRamaImage) await uploadFile(mivhanRamaImage, UploadivhanRamaImage, data.LicenseNumber);
      if (logbookImage) await uploadFile(logbookImage, UploadLogbookImage, data.LicenseNumber);

      Completedandmovingon();
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
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
        <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>הרשמה</h1>
        <form onSubmit={IfSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>מספר רישיון טיסה-מורכב מ4 ספרות<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="text" value={licenseNumber} onChange={(e) => sLicenseNumber(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>מספר תעודת זהות<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="text" value={id} onChange={(e) => sID(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>שם פרטי<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="text" value={firstName} onChange={(e) => sFirstName(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>שם משפחה<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="text" value={lastName} onChange={(e) => sLastName(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>תאריך לידה(חובה)<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="date" value={dateOfBirth} onChange={(e) => sDateOfBirth(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>מספר טלפון<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="tel" value={phoneNumber} onChange={(e) => sPhoneNumber(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>תוקף תעודה רפואית(חובה)<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="date" value={validityDateOfMedicalCertificate} onChange={(e) => sValidityDateOfMedicalCertificate(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>תוקף מבחן רמה(חובה)<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}> *</span></p>
            <input style={inputStyle} type="date" value={validityDateOfLevelTest} onChange={(e) => sValidityDateOfLevelTest(e.target.value)} dir="rtl" placeholder="שדה זה הינו חובה" />
          </div>
          <table style={{ marginBottom: '20px', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>צילום ת"ז</label>
                    <label htmlFor="id-upload" style={customFileInputStyle}>
                      בחר קובץ
                    </label>
                    <input
                      id="id-upload"
                      type="file"
                      onChange={IFFileChange(sIdImage)}
                      style={{ display: 'none' }}
                    />
                    {idImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{idImage.name}</p>}
                  </div>
                </td>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>תמונת פרופיל(חובה)<span style={{ color: 'red', fontWeight: 'bold', marginLeft: '5px' }}>*</span></label>
                    <label htmlFor="profile-upload" style={customFileInputStyle2}>
                      בחר קובץ(חובה)
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      onChange={IFFileChange(sProfileImage)}
                      style={{ display: 'none' }}
                    />
                    {profileImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{profileImage.name}</p>}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>צילום תעודה רפואית</label>
                    <label htmlFor="medical-upload" style={customFileInputStyle}>
                      בחר קובץ
                    </label>
                    <input
                      id="medical-upload"
                      type="file"
                      onChange={IFFileChange(sMedicalImage)}
                      style={{ display: 'none' }}
                    />
                    {medicalImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{medicalImage.name}</p>}
                  </div>
                </td>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>לוגבוק</label>
                    <label htmlFor="logbook-upload" style={customFileInputStyle}>
                      בחר קובץ
                    </label>
                    <input
                      id="logbook-upload"
                      type="file"
                      onChange={IFFileChange(sLogbookImage)}
                      style={{ display: 'none' }}
                    />
                    {logbookImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{logbookImage.name}</p>}
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>צילום מבחן רמה</label>
                    <label htmlFor="mivhan-upload" style={customFileInputStyle}>
                      בחר קובץ
                    </label>
                    <input
                      id="mivhan-upload"
                      type="file"
                      onChange={IFFileChange(sMivhanRamaImage)}
                      style={{ display: 'none' }}
                    />
                    {mivhanRamaImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{mivhanRamaImage.name}</p>}
                  </div>
                </td>
                <td style={{ width: '50%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <label style={{ fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 'smaller' }}>צילום רישיון טיסה</label>
                    <label htmlFor="license-upload" style={customFileInputStyle}>
                      בחר קובץ
                    </label>
                    <input
                      id="license-upload"
                      type="file"
                      onChange={IFFileChange(sLicenseImage)}
                      style={{ display: 'none' }}
                    />
                    {licenseImage && <p style={{ fontFamily: 'Arial, sans-serif' }}>{licenseImage.name}</p>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit" style={buttonStyle}>הגש</button>
          <br />
          <br />
          <button onClick={() => navigate('/LoginPage')} style={buttonStyle}>חזור</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  maxWidth: '265px',
  borderRadius: '20px',
  fontFamily: 'Arial, sans-serif',
  color: 'black',
  backgroundColor: 'white',
  padding: '10px',
  boxSizing: 'border-box',
  textAlign: 'right',
  outline: '1px solid red', 
  // outlineOffset: '2px' 
};

const customFileInputStyle = {
  display: 'inline-block',
  borderRadius: '20px',
  backgroundColor: 'white',
  color: 'green',
  padding: '10px 20px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  border: '2px solid white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  outline: 'none',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  fontSize: '12.5px',
};

const customFileInputStyle2 = {
  display: 'inline-block',
  borderRadius: '20px',
  backgroundColor: 'white',
  color: 'green',
  padding: '10px 20px',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  border: '2px solid red',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  outline: 'none',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  fontSize: '12.5px',
};

const buttonStyle = {
  borderRadius: '20px',
  backgroundColor: 'white',
  color: 'green',
  padding: '10px 20px',
  width: '100%', // Full width for mobile devices
  maxWidth: '300px', // Maximum width for larger screens
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  border: '2px solid balck',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  outline: 'none',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  textAlign: 'center'
};

const requiredstar = {
  color: 'red',
  fontweight: 'bold',
  marginleft: '5px',
  content: '*'
};


export default RegistrationPage;
