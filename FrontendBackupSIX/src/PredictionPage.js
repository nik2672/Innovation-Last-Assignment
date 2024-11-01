import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Fade, CircularProgress, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import MapComponent from './MapComponent';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function PredictionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [error, setError] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(true);
  const [chartData, setChartData] = useState({
    barData: { labels: [], datasets: [] },
    lineDataRooms: { labels: [], datasets: [] },
    lineDataDistance: { labels: [], datasets: [] }, // New Chart Data
  });

  // Define desired legend order for Bar Chart
  const barLegendOrder = [
    'Average Price of Property Type',
    'Your Predicted Price', // **Updated from 'Predicted Price'**
  ];

  // Define desired legend order for Line Chart (Rooms)
  const lineRoomsLegendOrder = [
    'Average Price by Number of Rooms',
    'Your Predicted Price', // **Updated from 'Predicted Price'**
  ];

  // Define desired legend order for Line Chart (Distance)
  const lineDistanceLegendOrder = [
    'Average Price by Distance',
    'Your Predicted Price', // **Updated from 'Predicted Price'**
  ];

  // Chart options for Bar Chart with custom legend sorting
  const barChartOptions = {
    responsive: true, // Added for responsiveness
    scales: {
      y: {
        stacked: false,
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
      x: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Property Type',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // Custom sort function for Bar Chart
          sort: (a, b) => {
            const orderA = barLegendOrder.indexOf(a.text);
            const orderB = barLegendOrder.indexOf(b.text);
            return orderA - orderB;
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Ensure two decimal places in tooltip
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      }
    },
  };

  // Chart options for Line Chart (Rooms) with custom legend sorting
  const lineRoomsChartOptions = {
    responsive: true, // Added for responsiveness
    scales: {
      y: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
      x: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Number of Rooms',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // Custom sort function for Line Chart (Rooms)
          sort: (a, b) => {
            const orderA = lineRoomsLegendOrder.indexOf(a.text);
            const orderB = lineRoomsLegendOrder.indexOf(b.text);
            return orderA - orderB;
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Ensure two decimal places in tooltip
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      }
    },
  };

  // Chart options for Line Chart (Distance) with custom legend sorting
  const lineDistanceChartOptions = {
    responsive: true, // Added for responsiveness
    scales: {
      y: {
        stacked: false,
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
      x: {
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Distance',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // Custom sort function for Line Chart (Distance)
          sort: (a, b) => {
            const orderA = lineDistanceLegendOrder.indexOf(a.text);
            const orderB = lineDistanceLegendOrder.indexOf(b.text);
            return orderA - orderB;
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Ensure two decimal places in tooltip
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      }
    },
  };

  useEffect(() => {
    const fetchPrediction = async () => {
      if (!formData) {
        setError('No data provided.');
        setLoadingPrediction(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const result = await response.json();
          // Round the predicted price to two decimal places
          const roundedPrice = parseFloat(result.predicted_price.toFixed(2));
          setPredictedPrice(roundedPrice);
          setError(null);
        } else {
          setError('Error fetching prediction.');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching prediction.');
      } finally {
        setLoadingPrediction(false);
      }
    };

    fetchPrediction();
  }, [formData]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('http://localhost:8000/data');
        const data = await response.json();

        // Compute Average Price by Property Type
        const priceByType = data.reduce((acc, curr) => {
          const type = curr.Type;
          const price = parseFloat(curr.Price);
          if (!isNaN(price)) {
            acc[type] = acc[type] ? [...acc[type], price] : [price];
          }
          return acc;
        }, {});

        const avgPriceByType = Object.keys(priceByType).map((type) => ({
          type,
          avgPrice:
            priceByType[type].reduce((a, b) => a + b, 0) / priceByType[type].length,
        }));

        // Compute Average Price by Number of Rooms
        const avgPriceByRooms = data.reduce((acc, curr) => {
          const rooms = parseInt(curr.Rooms, 10);
          const price = parseFloat(curr.Price);
          if (!isNaN(price)) {
            acc[rooms] = acc[rooms] ? [...acc[rooms], price] : [price];
          }
          return acc;
        }, {});

        const avgPricesByRooms = Object.keys(avgPriceByRooms).sort(
          (a, b) => a - b
        );

        // Define Distance Bins
        const distanceBins = [
          { label: '0-5 km', min: 0, max: 5 },
          { label: '5-10 km', min: 5, max: 10 },
          { label: '10-15 km', min: 10, max: 15 },
          { label: '15-20 km', min: 15, max: 20 },
          { label: '20+ km', min: 20, max: Infinity }, // Added to catch all distances beyond 20 km
        ];

        // Compute Average Price by Distance Bin
        const avgPriceByDistance = distanceBins.map(bin => {
          const pricesInBin = data
            .filter(row => parseFloat(row.Distance) >= bin.min && parseFloat(row.Distance) < bin.max)
            .map(row => parseFloat(row.Price))
            .filter(price => !isNaN(price));
          const avgPrice = pricesInBin.length > 0
            ? parseFloat((pricesInBin.reduce((a, b) => a + b, 0) / pricesInBin.length).toFixed(2))
            : 0;
          return { bin: bin.label, avgPrice };
        });

        // Determine Predicted Price's Distance Bin Index
        const predictedDistance = parseFloat(formData.Distance);
        const predictedPriceValue = predictedPrice;
        let predictedPriceBinIndex = distanceBins.findIndex(
          bin => predictedDistance >= bin.min && predictedDistance < bin.max
        );

        // Fallback in case predictedDistance doesn't fall into any bin (shouldn't happen due to '20+ km' bin)
        if (predictedPriceBinIndex === -1) {
          predictedPriceBinIndex = distanceBins.length - 1; // Assign to '20+ km' bin
        }

        // Prepare Data for Distance Chart
        const lineDataDistance = {
          labels: distanceBins.map(bin => bin.label),
          datasets: [
            {
              label: 'Average Price by Distance',
              data: avgPriceByDistance.map(d => d.avgPrice),
              borderColor: '#FF0000', // Red color
              backgroundColor: '#FF0000',
              fill: false,
              pointRadius: 5,
              order: 1,
            },
            {
              label: 'Your Predicted Price', // **Changed from 'Predicted Price'**
              data: distanceBins.map((bin, index) =>
                index === predictedPriceBinIndex ? predictedPriceValue : null
              ),
              type: 'line',
              borderColor: '#006400', // Dark Green color
              backgroundColor: '#006400',
              borderWidth: 3,
              pointRadius: 10,
              hoverRadius: 12,
              pointBackgroundColor: '#006400',
              pointStyle: 'star',
              showLine: false,
              order: 0,
            },
          ],
        };

        // Prepare Data for Bar Chart
        const barData = {
          labels: ['House', 'Townhouse', 'Unit'],
          datasets: [
            {
              label: 'Average Price of Property Type',
              data: avgPriceByType.map((d) => d.avgPrice),
              backgroundColor: ['#FF4C4C', '#FF0000', '#CC0000'], // Different shades of red
              borderColor: ['#B22222', '#8B0000', '#660000'],
              borderWidth: 1,
              order: 1, // Render second
            },
            {
              label: 'Your Predicted Price', // **Changed from 'Predicted Price'**
              data: avgPriceByType.map((d) =>
                formData.Type === d.type ? predictedPriceValue : null
              ),
              type: 'line',
              borderColor: '#006400', // Dark Green color
              backgroundColor: '#006400',
              borderWidth: 3,
              pointRadius: 10,
              hoverRadius: 12,
              pointBackgroundColor: '#006400',
              pointStyle: 'star',
              showLine: false,
              order: 0, // Render first to appear above
            },
          ],
        };

        // Prepare Data for Rooms Chart
        const lineDataRooms = {
          labels: avgPricesByRooms,
          datasets: [
            {
              label: 'Average Price by Number of Rooms',
              data: avgPricesByRooms.map(
                (room) =>
                  parseFloat((avgPriceByRooms[room].reduce((a, b) => a + b, 0) / avgPriceByRooms[room].length).toFixed(2))
              ),
              borderColor: '#FF0000', // Red color
              backgroundColor: '#FF0000',
              fill: false,
              pointRadius: 5,
              order: 1, // Render second
            },
            {
              label: 'Your Predicted Price', // **Changed from 'Predicted Price'**
              data: avgPricesByRooms.map((room) =>
                formData.Rooms === parseInt(room) ? predictedPriceValue : null
              ),
              type: 'line',
              borderColor: '#006400', // Dark Green color
              backgroundColor: '#006400',
              borderWidth: 3,
              pointRadius: 10,
              hoverRadius: 12,
              pointBackgroundColor: '#006400',
              pointStyle: 'star',
              showLine: false,
              order: 0, // Render first to appear above
            },
          ],
        };

        // Update chartData State
        setChartData({
          barData,
          lineDataRooms,
          lineDataDistance, // Add the new chart data
        });
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    if (predictedPrice !== null) {
      fetchChartData();
    }
  }, [predictedPrice, formData]);

  // Animation effect for price display
  useEffect(() => {
    if (predictedPrice !== null) {
      let start = 0;
      const increment = Math.ceil(predictedPrice / 50);
      const interval = setInterval(() => {
        start += increment;
        if (start >= predictedPrice) {
          clearInterval(interval);
          setDisplayedPrice(predictedPrice);
        } else {
          setDisplayedPrice(start);
        }
      }, 20);
      return () => clearInterval(interval); // Cleanup on unmount or change
    }
  }, [predictedPrice]);

  return (
    <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
      <Fade in timeout={1000}>
        <Box>
          {loadingPrediction && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {predictedPrice !== null && !loadingPrediction && (
            <>
              <Typography
                variant="h3"
                sx={{ mt: 4, mb: 4, textAlign: 'center', color: 'green', fontWeight: 'bold' }}
              >
                Predicted Price: ${displayedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>

              <MapComponent postcode={formData.Postcode} />

              {/* Bar Chart: Average Price by Property Type */}
              {chartData.barData.datasets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Price Distribution by Property Type
                  </Typography>
                  <Bar
                    data={chartData.barData}
                    options={barChartOptions}
                  />
                </Box>
              )}

              {/* Line Chart: Average Price by Number of Rooms */}
              {chartData.lineDataRooms.datasets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Average Price by Number of Rooms
                  </Typography>
                  <Line
                    data={chartData.lineDataRooms}
                    options={lineRoomsChartOptions}
                  />
                </Box>
              )}

              {/* Line Chart: Average Price by Distance */}
              {chartData.lineDataDistance.datasets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Average Price by Distance
                  </Typography>
                  <Line
                    data={chartData.lineDataDistance}
                    options={lineDistanceChartOptions}
                  />
                </Box>
              )}
            </>
          )}

          {error && (
            <Typography color="error" sx={{ mt: 4 }}>
              {error}
            </Typography>
          )}

          {/* Back Button */}
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}

export default PredictionPage;
