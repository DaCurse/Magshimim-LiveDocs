const express = require('express');
const router = express.Router();
const models = require('../models');
const { BadRequest, NotFound } = require('http-errors');

// Wrapper functions to forward errors from async scopes
const wrap = fn => (...args) => fn(...args).catch(args[2]);

router.post('/create', wrap(async (req, res) => {
    res.json({
        success: true,
        document: await models.Document.create({
            title: req.body.title,
            content: req.body.content || '',
        })
    });
}));

router.get('/get/:id', wrap(async (req, res) => {
    let id = parseInt(req.params.id);
    if (req.params.id.toLowerCase() === 'all') {
        res.json({success: true, documents: await models.Document.findAll()});
    } else if (!isNaN(id)) {
        let doc = await models.Document.findOne({where: {id: id}});
        if (doc === null) {
            throw NotFound('Document not found');
        } else {
            res.json({
                success: true,
                document: doc
            });
        }
    } else {
        throw BadRequest('Invalid ID');
    }
}));

router.post('/update/:id', wrap(async (req, res) => {
    let id = parseInt(req.params.id);
    if (!isNaN(id)) {
        let rows = await models.Document.update({
            title: req.body.title,
            content: req.body.content
        }, {where: {id: id}});
        res.json({
            success: !!rows[0],
            updatedRows: rows[0]
        });
    } else {
        throw BadRequest('Invalid ID');
    }
}));

module.exports = router;