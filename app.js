const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();

const dbURL = 'mongodb+srv://haris267:test1234@basicnode.rrtor.mongodb.net/unand-link?retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => {
        app.listen(3000);
        console.log('connect to db');
    })
    .catch(err => {
        console.log(err)
    }) 

// midleware
app.use(express.json());
app.use(cookieParser());

// register view engine
app.set('view engine', 'ejs');

// routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => {
    res.send('home')
})
app.use(userRouter);

