import express from 'express';
import Stripe from 'stripe';


/**
 * Load environment variables
 */
let env = require('../../config/development.js')
if (process.env.NODE_ENV === 'production') {
    env = require('../../config/production.js')
}

/**
 * Create a new express app
 */
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/**
 * Initialize the stripe client
 */
const stripe = Stripe(env.STRIPE_CLIENT_SECRET);


/**
 * Responds to /stripe
 */
app.get('/', (req, res, next) => {
    console.log("Running Express middleware")

    res.send('This does nothing at all');
});

/**
 * Responds to /stripe/dashboard
 * Redirects the user to their dashboard URL (given acct number)
 */
app.get('/dashboard', async (req, res, next) => {

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


/**
 * Responds to /stripe/dashboard
 * Returns the dashboard URL for the given acct number
 */
app.get('/balance', async (req, res, next) => {

    let acct = req.query.acct;

    if (acct) {
        let balance = await stripe.balance.retrieve({
            stripe_account: acct
        });
        res.send(balance);
    } else {
        res.send("Invalid Request");
    }

});



/**
 * Returns the dashboard URL for the given acct number
 * @todo Move charges to cloud functions
 */
app.post('/charges/direct', async (req, res, next) => {

    let acct = req.body.acct;
    let amount = req.body.amount;
    let source = req.body.source;


    if (acct) {
        try{
            let charge = await stripe.charges.create({
                amount: amount,
                currency: 'usd',
                source: acct,
                description: "Testing initial charges"
            })
            res.json(charge);
        }catch(err){
            console.log(err);
        }
    } else {
        res.send("Invalid Request");
    }

});

/**
 * Initializes this express middleware for Nuxt
 */
export default {
    path: '/stripe',
    handler: app
}

