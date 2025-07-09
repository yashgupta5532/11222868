import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Link
} from '@mui/material';
import { getAllUrls } from '../services/api';

const StatsPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllUrls();
        setUrls(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Typography>Loading statistics...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Short Link</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url, index) => (
              <TableRow key={index}>
                <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {url.originalUrl}
                </TableCell>
                <TableCell>
                  <Link href={url.shortLink} target="_blank" rel="noopener">
                    {url.shortLink.split('/').pop()}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(url.expiry).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={url.totalClicks} 
                    color={url.totalClicks > 0 ? 'primary' : 'default'} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StatsPage;