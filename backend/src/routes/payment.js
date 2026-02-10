const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/create-intent', auth.verifyToken, ctrl.createPaymentIntent);
router.get('/my', auth.verifyToken, ctrl.listPayments);

module.exports = router;
