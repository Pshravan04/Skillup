const router = require('express').Router();
const courseCtrl = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.get('/', courseCtrl.listCourses);
router.post('/', auth.verifyToken, auth.authorize('instructor'), courseCtrl.createCourse);
router.get('/:id', courseCtrl.getCourse);
router.post('/:id/enroll', auth.verifyToken, auth.authorize('student'), courseCtrl.enroll);

module.exports = router;
