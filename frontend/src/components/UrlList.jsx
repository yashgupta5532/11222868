import React from 'react';
import { Box, Typography, Link, Paper, Grid, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { logAction } from '../services/logger';

const UrlList = ({ urls }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    logAction('Copied URL to clipboard', { url: text });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Shortened URLs
      </Typography>
      {urls.map((url, index) => (
        <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Original:</strong> {url.originalUrl}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Link href={url.shortLink} target="_blank" rel="noopener">
                  {url.shortLink}
                </Link>
                <IconButton onClick={() => handleCopy(url.shortLink)} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2">
                Expires: {new Date(url.expiry).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default UrlList;