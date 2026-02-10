const router = require('express').Router();
const ctrl = require('../controllers/examController');
const auth = require('../middleware/auth');

router.get('/', ctrl.listExams);
router.post('/', auth.verifyToken, auth.authorize('instructor'), ctrl.createExam);
router.get('/:id', ctrl.getExam);

module.exports = router;
