const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body

	// Create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	})

	sendTokenResponce(user, 200, res)
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body

	// Validate emil & password
	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400))
	}

	// Check for user
	let user = await User.findOne({ email }).select('+password')

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401))
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password)

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 401))
	}

	sendTokenResponce(user, 200, res)
})

// Helper-function of sending a cookie with a token in it
// Get token from model, create coodie and send res.cookies
const sendTokenResponce = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken()

	const options = {
		// 30 days
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	}

	if (process.env.NODE_ENV === 'production') {
		options.secure = true
	}

	// Key(name of cookie), token, options
	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({ success: true, token })
}

// @desc      Get current logged user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id)

	res.status(200).json({
		success: true,
		data: user,
	})
})
