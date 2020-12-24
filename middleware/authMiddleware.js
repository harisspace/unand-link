const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, 'this is secret', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'this is secret', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            } else {
                let user = User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

const checkToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'this is secret', (err, decodedToken) => {
            if (err) {
                next();
            } else {
                res.redirect('/');
                next();
            }
        })
    } else {
        next();
    }
}

module.exports = { requireAuth, checkUser, checkToken };