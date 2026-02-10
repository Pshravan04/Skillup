const router = require('express').Router();
const ctrl = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/me', auth.verifyToken, auth.authorize('student'), ctrl.getProfile);
router.put('/me', auth.verifyToken, auth.authorize('student'), ctrl.updateProfile);

module.exports = router;
