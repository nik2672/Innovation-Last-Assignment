import React from 'react';
import { Container, Typography, Grid, Box, useTheme } from '@mui/material';

function About() {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* About Header */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', mb: 6 }}
      >
        About Us
      </Typography>

      {/* Our Story Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Our Story
        </Typography>
        <Grid container spacing={6} alignItems="center">
          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Our project aims to explore and assess housing prices and market trends across various property types in Melbourne, Australia. By leveraging machine learning techniques, our team has developed an AI model designed to accurately predict house prices based on the features you desire for your dream home. Additionally, our model analyzes fluctuations in Melbourne's real estate market using carefully curated datasets.
            </Typography>
          </Grid>
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/house.jpg"
              alt="Modern house in Melbourne"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Our AI Model Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Our AI Model
        </Typography>
        <Grid container spacing={6} alignItems="center">
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/aimodel.jpg"
              alt="AI model visualization"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
          {/* Text Content */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
            We have develped our AI price prediction model through testing and comparing various models such as regression, classification and neural networks with us picking the best to incorporate into our website. ⁤⁤Our neural network uses a deep architecture utilising three hidden layers consisting of 128, 64 and 32 neurons respetvely hence allowing us to capture complex pattters in our data. ⁤⁤By providing accurate price predictions our model helps empowers users to make informed decisions, whether they are buyers, sellers, investors, or real estate professionals, helping them navigate the complexities of the housing market with greater confidence. ⁤⁤
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>

        <Typography variant="body1" sx={{ maxWidth: 800, margin: '0 auto' }}>
        We welcome everyone to HighDistinctionOnly's real estate price prediction model, wheather youre a student, first home buyer, real estate agent or just willing to have fun with our model feel free to test/play around with our website the only limit is the extent of your imagination. ⁤
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
