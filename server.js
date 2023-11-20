const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();


app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(cors()); // Enable CORS for all routes

app.use(express.static(path.join(__dirname)));

app.get('/getIp', (req, res) => {
  const clientIp = req.clientIp.replace(/^.*:/, ''); // Extract the IPv4 address
  // Use req.headers to attempt to get the public IP address
  const publicIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.json({ ip: publicIp.replace(/^.*:/, '') || clientIp });
});

app.get('/', (req, res) => {
  // Send the index.html file as the response
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Custom middleware to handle proxy headers
app.use((req, res, next) => {
  // Get the client's IP address from multiple headers
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const clientIp = forwardedFor || realIp || req.clientIp;

  // Set the clientIp property on the request object
  req.clientIp = clientIp;

  next();
});

app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  console.log('Body:', req.body);
  next();
});

app.post('/getIpInfo', async (req, res) => {
  try {
    console.log("ip at server ", req.body);
    const response = await axios.get('https://ipwho.is/', {
      params: {
        ip: req.body.ip,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
