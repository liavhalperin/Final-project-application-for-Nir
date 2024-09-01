import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';

const ArticleList = ({ articles, loading, error }) => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Failed to load articles: {error.message}</Typography>;
    if (!articles || articles.length === 0) return <Typography>No articles found</Typography>;

    return (
        <div>
            {articles.map((article, index) => (
                <Box
                    key={article.ArticleNumber || index}
                    width="100%"
                    my={2}
                    p={2}
                    sx={{
                        border: '1px solid grey',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        margin: '0 auto'
                    }}
                >
                    <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: 'bold' }}>{article.subjectName}</Typography>
                    <Typography variant="h6" sx={{ fontSize: '16px', margin: '10px 0' }}>{article.title}</Typography>
                    <Typography variant="body1" sx={{ fontSize: '14px' }}>{article.content}</Typography>
                </Box>
            ))}
        </div>
    );
};

export default function Articles() {
    const [articles, sArticles] = useState(null);
    const [loading, sLoading] = useState(true);
    const [error, sError] = useState(null);

    const apiUrl = 'https://proj.ruppin.ac.il/bgroup35/test2/tar1/API/Articles/getallArticles';
    const location = useLocation();
    const obj = location.state?.obj || 'default';
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Network response was not ok.');
                const result = await response.json();
                sArticles(result);
            } catch (error) {
                sError(error);
            } finally {
                sLoading(false);
            }
        };

        fetchArticles();
    }, [apiUrl]);

    const buttonStyle = {
        marginBottom: '20px',
        backgroundColor: 'white',
        color: '#4caf50',
        fontWeight: 'bold',
        borderRadius: '20px',
        padding: '10px 30px',
        width: '100%', // Full width for mobile devices
        maxWidth: '300px', // Maximum width for larger screens
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s ease',
        fontFamily: 'Arial, sans-serif',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: '#ccc',
        },
    };

    const GoBack = () => {
        navigate('/HomePage', { state: { obj } });
    }

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
            <Box sx={{ width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif' }}>פורום טייסים</h1>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/AddArticle', { state: { obj } })}
                        sx={buttonStyle}
                    >
                        הוסף תגובה
                    </Button>
                </div>
                <Button
                    variant="contained"
                    onClick={GoBack}
                    sx={buttonStyle}
                >
                    חזור
                </Button>
                <ArticleList articles={articles} loading={loading} error={error} />
            </Box>
        </div>
    );
}
