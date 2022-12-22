const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const ActivateController = require('../controllers/activate.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/send-otp', AuthController.sendOtp);
router.post('/verify-otp', AuthController.verifyOtp);
router.post('/activate', authMiddleware ,ActivateController.activate);
router.get('/refresh', AuthController.refresh);


module.exports = router;