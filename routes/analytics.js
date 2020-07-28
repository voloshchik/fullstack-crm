const express = require('express');

const router = express.Router();
const controller = require('../controllers/analytics');
router.get('/analytics', controller.analytics);

router.get('/overview', controller.overview);

module.exports = router;
