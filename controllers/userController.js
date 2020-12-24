const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleError = (err) => {
    let errors = { email: '', password: '', firstName: '' };

    // error login
    if (err.message === 'incorrect email') {
        errors.email = 'that email is no registered';
    }

    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
    }

    // error signup
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'this is secret', {
        expiresIn: maxAge
    })
}


// login_get
module.exports.login_get = (req, res) => {
    res.render('users/login')
}

// login_post

// sigup_get
module.exports.signup_get = (req, res) => {
    // const { email, password, firstName, lastName } = req.body;
    res.render('users/signup')
}

// signup_post
module.exports.signup_post = async (req, res) => {
    const {email, password, firstName, lastName} = req.body;

    try {
        const user = await User.create({email, password, firstName, lastName});

        if (user) {
            const token = createToken(user._id);
            res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
            res.status(200).json({ user: user.firstName });
        }
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors })
    }
}

// login_post
module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        res.cookie('jwt', createToken(user._id), { maxAge: maxAge * 1000 });
        res.status(200).json({ user: user.firstName })
    }
    catch (err) {
        const errors = handleError(err);
        res.status(400).json({ errors })
    }
}