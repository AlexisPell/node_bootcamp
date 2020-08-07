const express = require('express')
const advancedResults = require('./../middleware/advancedResults')
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require('./../controllers/bootcamps')

const { protect, authorize } = require('./../middleware/auth')

const Bootcamp = require('./../models/Bootcamp')

// Include other resource router
const courseRouter = require('./courses')

const router = express.Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp)

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router
