const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routesHandler/todoHandler');

const app = express();
const port = 3000;
app.use(express.json());

// Database connection with mongoose
mongoose
    .connect('mongodb://localhost/todos')
    .then(() => console.log('connection successfull'))
    .catch((err) => console.log(err));

app.use('/todo', todoHandler);

// Error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}
app.listen(port, () => console.log('app is listining on port 3000'));
