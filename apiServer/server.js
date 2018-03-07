const cors = require('express-cors');
const app = require('express')();
const port = 3030;

app.use(cors({
  allowedOrigins: ['localhost:3000']
}));

app.get('/api/v1/pictures', (req, res) => {
  console.log('Incoming GET request');
  res.send('Hi! I\'m a GET!')
});

app.post('/api/v1/pictures', (req, res) => {
  console.log('Incoming POST request');
  res.send('Hi! I\'m a POST!')
});

app.listen(port, () => {
  console.log(`Server run on ${port} port`)
});