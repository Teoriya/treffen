const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const RoomController = require('../controllers/room.controller');

router.post('/create', authMiddleware ,RoomController.createRoom);
router.get('/', authMiddleware ,RoomController.fetchRooms);


module.exports = router;