import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { logAction } from '../services/logger';

const ShortenerPage = () => {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleUrlCreated = (results) => {
    logAction('URLs shortened successfully', results);
    setShortenedUrls([...results, ...shortenedUrls]);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        URL Shortener
      </Typography>
      <Typography variant="body1" paragraph>
        Shorten up to 5 URLs at once. Optionally specify validity period and custom shortcode.
      </Typography>
      
      <UrlForm onUrlCreated={handleUrlCreated} />
      {shortenedUrls.length > 0 && <UrlList urls={shortenedUrls} />}
    </Container>
  );
};

export default ShortenerPage;