const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const app = express()

// Load env vars
dotenv.config({ path: './config/config.env' })

// Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

// Connect DB
connectDB()

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// File uploading
app.use(fileupload())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Init middleware / Body parser
app.use(express.json())

// Mounte Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
	PORT,
	console.log(`Server is running on port ${PORT}`.blue.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`)
	// Close server and exit process
	server.close(() => process.exit(1))
})
