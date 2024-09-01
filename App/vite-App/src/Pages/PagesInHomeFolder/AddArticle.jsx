import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation, useNavigate } from "react-router-dom";

export default function AddArticle() {
    const [subjectName, setSubjectName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submissionError, setSubmissionError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const obj = location.state?.obj || '';
    const licenseNumber = obj.licenseNumber;

    const subjectsApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/articles/getallArticleSubjects';
    const addArticleApiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/api/articles/addarticle';

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(subjectsApiUrl);
                if (!res.ok) throw new Error('Network response was not ok.');
                const result = await res.json();
                setSubjects(result);
            } catch (error) {
                console.error("Fetch error: ", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const DSubmit = async (e) => {
        e.preventDefault();
        setSubmissionError(null);
        setSuccessMessage(null);

        const newArticle = {
            Title: title,
            Content: content,
            SubjectName: subjectName,
            WriterLicenseNumber: licenseNumber,
        };

        try {
            const res = await fetch(addArticleApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newArticle),
            });

            if (!res.ok) throw new Error('Failed to add article');

            setSuccessMessage('Article added successfully');
            setOpenSnackbar(true);
            setTitle('');
            setContent('');
            setSubjectName('');
        } catch (error) {
            console.error("Submit error: ", error);
            setSubmissionError(error.message);
            setOpenSnackbar(true);
        }
    };

    const DBack = () => {
        navigate('/Articles', { state: { obj } });
    };

    const CloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const buttonStyle = {
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
    };

    return (
        <div
            style={{
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
            }}
            dir="rtl" // Set the direction to right-to-left for the overall layout
        >
            <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <Box sx={{ padding: 2 }}>
                    <h1>הוסף תגובה</h1>
                    <h2>נושא</h2>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Typography color="error" sx={{ color: 'white' }}>Failed to load subjects: {error.message}</Typography>
                    ) : (
                        <form onSubmit={DSubmit}>
                            <FormControl component="fieldset" margin="normal">
                                <RadioGroup
                                    aria-label="subject"
                                    name="subject"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                >
                                    {subjects.map(subject => (
                                        <FormControlLabel
                                            key={subject}
                                            value={subject}
                                            control={<Radio />}
                                            label={subject}
                                            sx={{ color: 'white' }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="כותרת"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                InputLabelProps={{ style: { color: 'white', textAlign: 'right' } }} // Align label to the left
                                InputProps={{ style: { color: 'white', direction: 'ltr' } }} // Set the text direction to left-to-right
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="תוכן"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                InputLabelProps={{ style: { color: 'white', textAlign: 'right' } }} // Align label to the left
                                InputProps={{ style: { color: 'white', direction: 'ltr' } }} // Set the text direction to left-to-right
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ ...buttonStyle, marginTop: 2, marginBottom: '0px' }}
                            >
                                שלח
                            </Button>
                            <br />
                            <Button
                                variant="contained"
                                onClick={DBack}
                                sx={{ ...buttonStyle, marginTop: 2 }}
                            >
                                חזור
                            </Button>
                        </form>
                    )}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={6000}
                        onClose={CloseSnackbar}
                    >
                        <Alert
                            onClose={CloseSnackbar}
                            severity={submissionError ? "error" : "success"}
                            sx={{ width: '100%' }}
                        >
                            {submissionError || successMessage}
                        </Alert>
                    </Snackbar>
                </Box>
            </div>
        </div>
    );
}
