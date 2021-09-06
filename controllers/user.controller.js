const models = require("../models");
const bcryptjs = require("../node_modules/bcryptjs");
const jwt = require("jsonwebtoken");

function signUp(req, res) {
	// check if the email address is already exist
	models.User.findOne({ where: { email: req.body.email } })
		.then(result => {
			// if email already exists
			if (result) {
				res.status(409).json({
					message: "Email already exists",
				});
			}

			// if email does not exist
			else {
				// generate a salt for hashing
				bcryptjs.genSalt(10, function (err, salt) {
					// hashing the password
					bcryptjs.hash(req.body.password, salt, function (err, hash) {
						const user = {
							name: req.body.name,
							email: req.body.email,
							password: hash,
						};

						models.User.create(user)
							.then(result => {
								res.status(201).json({
									message: "User created successfully",
								});
							})
							.catch(error => {
								res.status(500).json({
									message: "something went wrong",
								});
							});
					});
				});
			}
		})
		.catch(error => {});
}

function login(req, res) {
	// checking the email whether it is stored in db
	models.User.findOne({ where: { email: req.body.email } })
		.then(user => {
			if (user === null) {
				res.status(401).json({
					message: "Email address invalid!",
				});
			} else {
				bcryptjs.compare(
					req.body.password,
					user.password,
					function (err, result) {
						if (result) {
							const token = jwt.sign(
								{
									email: user.email,
									userId: user.userId,
								},
								"secret",
								function (err, token) {
									res.status(200).json({
										message: "Authentication successfull",
										token: token,
									});
								},
							);
						} else {
							res.status(401).json({
								message: "Ivalid cerdentials !",
							});
						}
					},
				);
			}
		})
		.catch(error => {
			res.status(500).json({
				message: "Somethong went wrong !",
			});
		});
}

module.exports = {
	signUp: signUp,
	login: login,
};
