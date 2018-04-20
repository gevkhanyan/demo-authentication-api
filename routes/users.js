const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');

/* GET users listing. */
router.post('/get-token', function (req, res, next) {
	UsersController.getCurrentUserToken(req, res)
});

router.post('/login', function (req, res, next) {
	UsersController.login(req, res);
});

router.post('/sign-up', function (req, res, next) {
	UsersController.signUp(req, res);
});

router.put('/reset-password/:id', function (req, res, next) {
	UsersController.resetUserPassword(req, res);
});

router.post('/check-token/:id', function (req, res, next) {
	UsersController.tokenValidation(req, res);
});

router.post('/check-old-password/:id', function (req, res, next) {
	UsersController.checkOldPassword(req, res);
});

module.exports = router;
