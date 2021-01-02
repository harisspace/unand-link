// home_get, shortUrl_post, myLinks_get, shortUrl_get
const Link = require('../models/Link');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// function
const handleError = (err) => {
    let errors = { short: '' }

    if (err.message === 'Link validation failed: shortLink: Path `shortLink` is required.') {
        Object.values(err.errors).forEach(({properties}) => {
            if (properties.message === 'Path `shortLink` is required.') {
                errors.short = 'short-link required';
            }
        })
    } else {
        console.log('hai')
    }

    return errors;
}

module.exports.home_get = (req, res) => {
    res.render('home/home');
}


module.exports.shortUrl_post = async (req, res) => {
    let { fullLink, shortLink } = req.body;

    // get the author from db when user login and replace the email to the author
    const token = req.cookies.jwt;
    
    // check token exist?
    let user;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
               console.log(err);
            }
            user = await User.findById(decodedToken.id);
            try {
                // handle short link
                shortLink = shortLink.replace(/\s+/g, '');
                shortLink = shortLink.slice(15);

                const { email } = user;
                const link = await Link.create({
                    fullLink, 
                    shortLink,
                    author: email
                });
        
                if (link) {
                    res.redirect('/my-links')
                }
            } catch(err) {
                const errors = handleError(err);
                res.status(400).json({ errors })
            }
        })
    }
}

module.exports.myLinks_get = async (req, res) => {
    const token = req.cookies.jwt;
    
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            if (err) {
                console.log(err)
            }
            let user = await User.findById(decodedToken.id);
            let { email } = user;
            
            let userLinks = await Link.find({ author: email });
            if (userLinks) {
                res.render('links/my-links', { linkDetails: userLinks });
            } else {
                res.render('links/my-links', { linkDetails: "you have no shorten link yet" })
            }
        })
    } else {
        res.redirect('/login')
    }
}

module.exports.shortUrl_get = async (req, res) => {
    const shortLink = req.params.shortLink;
    
    try {
        const link = await Link.findOne({ shortLink });
        if (link === null) {
            res.sendStatus(404)
        } else {
            console.log(link)
            link.clicks++;
            link.save();
        }

        res.redirect(link.fullLink);
    } catch(err) {
        console.log(err);
        res.sendStatus(404);
    }

}

module.exports.link_delete = (req, res) => {
    const id = req.params.id;

    Link.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/my-links'})
            // console.log(result)
        })
        .catch(err => {
            // console.log(err);
            res.json({ err })
        })
}