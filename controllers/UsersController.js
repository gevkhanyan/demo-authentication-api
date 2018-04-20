const Users = require('../models/Users');
const PropertyHelper = require('../helpers/PropertyHelper');
const sha256 = require('sha256');
const jwt = require('jsonwebtoken');


exports.signUp = (req, res) => {
	PropertyHelper.validateReqData(req, 'body', ['fullname', 'username', 'password', 'email'], (err, errorProps) => {
		if (!err) {
			new Users({
				fullname: req.body.fullname,
				username: req.body.username,
				password: sha256(req.body.password),
				email: req.body.email,
			}).save((err, user) => {
				if (!err) {
					res.json({error: false, user: user});
				} else {
					res.json({error: true, message: "Error on saving new user.", errorMessage: err})
				}
			});
		} else {
			res.json({error: true, message: "error on property validations", errorProps: errorProps})
		}
	});
};

exports.login = (req, res) => {
	PropertyHelper.validateReqData(req, 'body', ['email', 'password'], function (prpError, notValidProps) {
		if (!prpError) {
			Users.findOne({
				$and: [
					{email: req.body.email},
					{password: sha256(req.body.password)}
				]
			}, function (err, user) {
				if (!err && user) {
					let token = jwt.sign({
						data: {
							username: user.username,
							email: user.email,
							id: user._id
						}
					}, global.secret);
					res.json({
						error: false,
						data: {
							username: user.username,
							id: user._id,
							email: user.email,
							token: token
						}
					});
				} else {
					res.json({error: true, message: "User not found or wrong credentials."});
				}
			})
		} else {
			res.json({error: true, message: "Invalid arguments", props: notValidProps});
		}
	});
};

exports.resetUserPassword = (req, res) => {
	PropertyHelper.validateReqData(req, 'body', ['token', 'password'], (err, errorProps) => {
		if (!err) {
			Users.findOne({_id: req.params.id}, (err, data) => {
				if (!err) {
					data.password = sha256(req.body.password);
					data.save((err, user) => {
						if (!err) {
							res.json({error: false, data: user});
						} else {
							res.json({error: true, message: "error on update"})
						}
					})
				} else {
					res.json({error: true, message: "Error on selecting user"})
				}
			});
		} else {
			res.json({error: true, message: "error on prop validation", errProps: errorProps});
		}
	})
};

exports.checkOldPassword = (req, res) => {
	PropertyHelper.validateReqData(req, 'body', ['password'], (err, errorProps) => {
		if (!err) {
			Users.findOne({_id: req.params.id}, (err, data) => {
				if (!err) {
					if(data.password === sha256(req.body.password)){
						res.json({error: false, data: data})
					}else{
						res.json({error: true, message: "Password is not correct"})
					}
				}else{
					res.json({error: true, message: "error finding user"})
				}
			})
		}else{
			res.json({error: true, message: "error on req body validation"})
		}
	})
};

exports.getCurrentUserToken = (req, res) => {
	Users.findOne({email: req.body.email}, (err, user) => {
		if (!err && user) {
			let token = jwt.sign({
				data: {
					username: user.username,
					email: user.email,
					id: user._id
				}
			}, global.secret);
			res.json({
				error: false,
				data: {
					token: token,
					id: user._id
				}
			});
		} else {
			res.json({error: true, message: "Error on selecting user."})
		}
	})
};

exports.tokenValidation = (req, res) => {
	let token = req.headers.token;
	if (typeof token != 'undefined' && token != null && token != '') {
		jwt.verify(token, global.secret, function (err, decoded) {
			if (!err && typeof decoded != 'undefined') {
				Users.findOne({_id: req.params.id}, (err, user) => {
					if (!err && user) {
						res.json({error: false, data: user});
					} else {
						res.json({error: true, message: "no such user"})
					}
				});
			} else {
				res.json({error: true, message: "error"});
			}
		});
	} else {
		res.json({error: true, message: "token undefined"})
	}
};

