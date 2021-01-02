const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const linkRouter = require('./routes/linkRoutes');
const { urlencoded } = require('express');
require('dotenv').config();

const app = express();

const dbURL = process.env.DB_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(res => {
        app.listen(3000);
        console.log('connect to db');
    })
    .catch(err => {
        if (err.code === 'ETIMEOUT') {
            console.log('please refresh')
        }
        console.log(err)
    }) 

// midleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }))

// register view engine
app.set('view engine', 'ejs');

// routes
app.get('*', checkUser);
app.use(userRouter);
app.use(linkRouter)

