const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');

// eslint-disable-next-line new-cap
const Todo = new mongoose.model('Todo', todoSchema);

// get all todos
router.get('/', async (req, res) => {
    await Todo.find({ status: 'active' })
        .select({
            _id: 0,
            data: 0,
            __v: 0,
        })
        .limit(1)
        .exec((err, data) => {
            if (err) {
                res.status(500).json({ error: 'There was a serverside error' });
            } else {
                res.status(200).json({
                    result: data,
                    message: 'successfull',
                });
            }
        });
});
// get a todo
router.get('/:id', async (req, res) => {
    await Todo.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'There was a serverside error' });
        } else {
            res.status(200).json({
                result: data,
                message: 'successfull',
            });
        }
    });
});
// post a todos
router.post('/', async (req, res) => {
    const newTodo = new Todo(req.body);
    await newTodo.save((err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a serverside error',
            });
        } else {
            res.status(200).json({
                message: 'Todo was inserted successfully',
            });
        }
    });
});
// post multiple todos
router.post('/all', async (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if (err) {
            res.status(500).json({
                error: 'There was a serverside error',
            });
        } else {
            res.status(200).json({
                message: 'Todos were successfully inserted',
            });
        }
    });
});
// put  todos
router.put('/:id', async (req, res) => {
    try {
        const result = await Todo.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: { status: 'inactive' } },
            // eslint-disable-next-line prettier/prettier
            { new: true },
        );
        res.status(200).json({ message: 'Todo was successfully update' });
        console.log(result);
    } catch (err) {
        res.status(500).json({ error: 'There was a serverside error' });
    }
});
// delete todo
router.delete('/:id', async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch {
        res.status(500).json({ error: 'There was a serverside error' });
    }
});

module.exports = router;
