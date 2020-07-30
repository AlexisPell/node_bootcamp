const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
	const connect = await mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})

	console.log(`MongoDB connected...`.blue.bold)
}

module.exports = connectDB
