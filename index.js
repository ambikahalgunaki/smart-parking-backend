const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const connectDB = require('./utils/db')

const vehicleRoute = require('./routes/vehicleRoute')
const paymentRoute = require('./routes/paymentRoute')
const bookingRoute = require('./routes/bookingRoute')
const slotRoute = require('./routes/slotRoute')
const authRoute = require('./routes/authRoute');
const aggregateRoute = require('./routes/aggregateRoute')
const server = express()

connectDB()
server.use(cors())
server.use(express.json())
server.use('/api/vehicle', vehicleRoute)
server.use('/api/payment', paymentRoute)
server.use('/api/booking', bookingRoute)
server.use('/api/slot', slotRoute)
server.use('/api/aggregate', aggregateRoute)
server.use('/api/auth', authRoute);
server.listen(3000, () => {
    console.log('Server started listening on port 3000')
})