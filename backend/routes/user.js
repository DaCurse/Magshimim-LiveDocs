const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { NotFound, Unauthorized } = require('http-errors');
const { wrap, hashPassword, verifyPassword, createJWT } = require('../util');

router.post(
	'/register',
	wrap(async (req, res) => {
		await User.create({
			username: req.body.username,
			password: await hashPassword(req.body.password),
		});
		// Extract password to not send the hash to the user
		// eslint-disable-next-line
		res.json({
			success: true,
		});
	}),
);

router.post(
	'/login',
	wrap(async (req, res) => {
		const user = await User.findOne({ where: { username: req.body.username } });
		if (!user) {
			throw NotFound("User doesn't exist");
		}
		if (await verifyPassword(req.body.password, user.password)) {
			const { id, username } = user;
			res.json({
				success: true,
				user: { id, username },
				jwt: createJWT({ id, username }),
			});
		} else {
			throw Unauthorized('Invalid Password');
		}
	}),
);

module.exports = router;
