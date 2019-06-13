import express from 'express';
import Stripe from 'stripe';

let env = require('../../config/development.js')

if (process.env.NODE_ENV === 'production') {
    env = require('../../config/production.js')
}


const app = express();

app.get('/', (req, res, next) => {
    console.log("Running Express middleware")

    res.send('This does nothing at all');
});

app.get('/dashboard', async (req, res, next) => {
    const stripe = Stripe(env.STRIPE_CLIENT_SECRET);

    let acct = req.query.acct;

    if(acct){
        let { url } = await stripe.accounts.createLoginLink(acct, {
            redirect_url: req.get('Referrer')
        });
        res.redirect(url);
    }else {
        res.send("Invalid Request");
    }

});


export default {
    path: '/stripe',
    handler: app
}

