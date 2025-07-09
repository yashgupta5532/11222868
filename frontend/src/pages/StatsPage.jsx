import React from "react";
import { Container, Typography } from "@mui/material";

const StatsPage = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        URL Statistics
      </Typography>
      <Typography variant="body1">
        Statistics page will be implemented here
      </Typography>
    </Container>
  );
};

export default StatsPage;
