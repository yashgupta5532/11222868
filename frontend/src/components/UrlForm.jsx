import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { createShortUrl } from '../services/api';
import { logAction } from '../services/logger';

const UrlForm = ({ onUrlCreated }) => {
  const [urls, setUrls] = useState([{ originalUrl: '', validity: '', shortcode: '' }]);
  const [errors, setErrors] = useState([]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = [];
    const validUrls = [];

    urls.forEach((url, index) => {
      if (!url.originalUrl) {
        newErrors[index] = { ...newErrors[index], originalUrl: 'URL is required' };
        return;
      }

      if (!validateUrl(url.originalUrl)) {
        newErrors[index] = { ...newErrors[index], originalUrl: 'Invalid URL format' };
        return;
      }

      if (url.validity && isNaN(url.validity)) {
        newErrors[index] = { ...newErrors[index], validity: 'Validity must be a number' };
        return;
      }

      validUrls.push({
        url: url.originalUrl,
        validity: url.validity ? parseInt(url.validity) : undefined,
        shortcode: url.shortcode || undefined
      });
    });

    setErrors(newErrors);

    if (validUrls.length > 0) {
      try {
        const results = await Promise.all(validUrls.map(url => createShortUrl(url)));
        onUrlCreated(results);
        setUrls([{ originalUrl: '', validity: '', shortcode: '' }]);
      } catch (error) {
        logAction('Form submission error', error);
      }
    }
  };

  return (
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
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              fullWidth
              label="Custom Shortcode"
              value={url.shortcode}
              onChange={(e) => handleInputChange(index, 'shortcode', e.target.value)}
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
        <Button type="submit" variant="contained" color="primary">
          Shorten URLs
        </Button>
      </Box>
    </Box>
  );
};

export default UrlForm;