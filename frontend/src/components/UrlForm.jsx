import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Box, 
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { createShortUrl } from '../services/api';
import { logAction } from '../services/logger';

const UrlForm = ({ onUrlCreated }) => {
  const [urls, setUrls] = useState([{ originalUrl: '', validity: '', shortcode: '' }]);
  const [errors, setErrors] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
    // Clear error when user types
    if (errors[index]?.[field]) {
      const newErrors = [...errors];
      delete newErrors[index][field];
      setErrors(newErrors);
    }
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      // Remove corresponding errors
      const newErrors = errors.filter((_, i) => i !== index);
      setErrors(newErrors);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];
    let hasErrors = false;

    // Validate all URLs first
    urls.forEach((url, index) => {
      const currentErrors = {};
      
      if (!url.originalUrl) {
        currentErrors.originalUrl = 'URL is required';
        hasErrors = true;
      } else if (!validateUrl(url.originalUrl)) {
        currentErrors.originalUrl = 'Invalid URL format';
        hasErrors = true;
      }

      if (url.validity && isNaN(url.validity)) {
        currentErrors.validity = 'Validity must be a number';
        hasErrors = true;
      }

      if (Object.keys(currentErrors).length > 0) {
        newErrors[index] = currentErrors;
      }
    });

    setErrors(newErrors);
    if (hasErrors) return;

    try {
      const results = [];
      
      for (const url of urls) {
        if (!url.originalUrl) continue;
        
        try {
          const response = await createShortUrl({
            url: url.originalUrl,
            validity: url.validity ? parseInt(url.validity) : undefined,
            shortcode: url.shortcode || undefined
          });

          if (response.existing) {
            setSnackbar({
              open: true,
              message: `URL already exists: ${response.shortLink}`,
              severity: 'info'
            });
            results.push(response);
          } else {
            results.push(response);
          }
        } catch (error) {
          logAction('Error shortening URL', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.error || 'Failed to shorten URL',
            severity: 'error'
          });
        }
      }

      if (results.length > 0) {
        onUrlCreated(results.filter(r => r));
        setUrls([{ originalUrl: '', validity: '', shortcode: '' }]);
      }
    } catch (error) {
      logAction('Form submission error', error);
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {urls.map((url, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original URL"
                value={url.originalUrl}
                onChange={(e) => handleInputChange(index, 'originalUrl', e.target.value)}
                error={!!errors[index]?.originalUrl}
                helperText={errors[index]?.originalUrl}
                required
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Validity (minutes)"
                type="number"
                value={url.validity}
                onChange={(e) => handleInputChange(index, 'validity', e.target.value)}
                error={!!errors[index]?.validity}
                helperText={errors[index]?.validity}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={url.shortcode}
                onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
                error={!!errors[index]?.shortcode}
                helperText={errors[index]?.shortcode}
              />
            </Grid>
            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              {urls.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeUrlField(index)}
                  fullWidth
                >
                  Remove
                </Button>
              )}
            </Grid>
          </Grid>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={addUrlField}
            disabled={urls.length >= 5}
          >
            Add Another URL
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={urls.some(url => !url.originalUrl)}
          >
            Shorten URLs
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UrlForm;