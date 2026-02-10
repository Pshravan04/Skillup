const router = require('express').Router();
const ctrl = require('../controllers/instructorController');
const auth = require('../middleware/auth');

router.get('/me', auth.verifyToken, auth.authorize('instructor'), ctrl.getProfile);
router.put('/me', auth.verifyToken, auth.authorize('instructor'), ctrl.updateProfile);

module.exports = router;
