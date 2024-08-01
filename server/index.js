const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const ApartmentRoute = require('./routes/ApartmentRoute');
const AmenityRoute = require('./routes/AmenityRoute');
const RoomRoute = require('./routes/RoomRoute');
const LikeRoute = require('./routes/LikeRoute');
const UserRoute = require('./routes/UserRoute');
const ExternalAPIRoute = require('./routes/ExternalAPIRoute');

// express init
const app = express();
const port = process.env.PORT || 8000;

// express config
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // Replace with your client origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

//requests
app.use(ApartmentRoute);
app.use(AmenityRoute);
app.use(RoomRoute);
app.use(LikeRoute);
app.use(UserRoute);
app.use(ExternalAPIRoute);

// Connect to the database and start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
  
module.exports = app;