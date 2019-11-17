const express = require('express');
const router = express.Router();
const models = require('../models');
const createError = require('http-errors');
const validFilename = require('valid-filename');

// Wrapper functions to handle errors from promises
const wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/create', wrap(async (req, res, next) => {
    if (!validFilename(req.body.title)) {
        next(createError(400, 'Invalid title'));
        return;
    }
    res.json(
        await models.Document.create({
            title: req.body.title,
            content: req.body.content || '',
        })
    );
}));

router.get('/get/:id', wrap(async (req, res, next) => {
    let id = parseInt(req.params.id);
    if (req.params.id.toLowerCase() === 'all') {
        res.json(await models.Document.findAll());
    } else if (!isNaN(id)) {
        let doc = await models.Document.findOne({where: {id: id}});
        if (doc === null) {
            next(createError(404, 'Document not found'));
        } else {
            res.json(doc);
        }
    } else {
        next(createError(400, 'Invalid ID'));
    }
}));

module.exports = router;