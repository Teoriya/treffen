const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');

router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);


module.exports = router;