const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('./../utils/errorResponse')
const User = require('./../models/User')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers

	let token

	if (authorization && authorization.startsWith('Bearer')) {
		token = authorization.split(' ')[1]
	}

	// else if (req.cookies.token) {
	//   token = req.cookies.token
	// }

	// Sure token exists
	if (!token) {
		return next(new ErrorResponse('Not authorised to access this route', 401))
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		console.log(decoded)

		req.user = await User.findById(decoded.id)

		next()
	} catch (err) {
		return next(new ErrorResponse('Not authorised to access this route', 401))
	}
})

// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`'${req.user.role}' role is unallowed to use this route`,
					403
				)
			)
		}
		next()
	}
}
