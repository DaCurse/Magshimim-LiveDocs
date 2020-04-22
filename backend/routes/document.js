const express = require('express');
const router = express.Router();
const { Document } = require('../models');
const { NotFound } = require('http-errors');
const { wrap, parseIntParam } = require('../util');

router.post(
	'/',
	wrap(async (req, res) => {
		res.json({
			success: true,
			document: await Document.create({
				title: req.body.title,
				content: req.body.content || '',
			}),
		});
	}),
);

router.get(
	'/',
	wrap(async (req, res) =>
		res.json({ success: true, documents: await Document.findAll() }),
	),
);

router.get(
	'/:id',
	wrap(async (req, res) => {
		const id = parseIntParam(req.params, 'id');
		const document = await Document.findOne({ where: { id } });
		if (document !== null) {
			res.json({
				success: true,
				document,
			});
		} else {
			throw NotFound('Document not found');
		}
	}),
);

router.patch(
	'/:id',
	wrap(async (req, res) => {
		const id = parseIntParam(req.params, 'id');
		const rows = await Document.update(
			{
				title: req.body.title,
				content: req.body.content,
			},
			{ where: { id } },
		);
		res.json({
			success: true,
			updatedRows: rows[0],
		});
	}),
);

router.delete(
	'/:id',
	wrap(async (req, res) => {
		const id = parseIntParam(req.params, 'id');
		const result = await Document.destroy({ where: { id } });
		if (result) {
			res.json({ success: true });
		} else {
			res.status(404);
			res.json({ success: false });
		}
	}),
);

module.exports = router;
