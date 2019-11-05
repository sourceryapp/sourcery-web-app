import { db } from '~/plugins/firebase-client-init.js'
import cookieParser from 'cookieparser'
import jwt_decode from 'jwt-decode'
import accounting from 'accounting-js'


export const Utils = {

    /**
     * Get First Name
     * Assumes str is a full name
     * "Brian Daley" would return "Brian"
     */
    getFirstName: str => str.split(' ').slice(0, -1).join(' '),

    /**
    * Get Last Name
    * Assumes str is a full name
    * "Brian Daley" would return "Daley"
    */
    getLastName: str => str.split(' ').slice(-1).join(' '),

    /**
     * Builds a query string from an object of parameters
     */
    buildQueryString: params => Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&'),

    getUserFromCookie: (cookie) => {


        const parsed = cookieParser.parse(cookie)

        let name, picture, user_id, email = null;
        if (parsed.token) {
            let { name, picture, user_id, email } = jwt_decode(parsed.token);

            return {
                email: email,
                uid: user_id,
                displayName: name,
                photoURL: picture
            };
        }


    },

    addressToEncodedString: (repository) => {
        return repository.address1.concat(
            repository.address2 ? `,${encodeURIComponent(repository.address2)}` : '',
            `,${encodeURIComponent(repository.city)}`,
            `,${encodeURIComponent(repository.state)}`
        );
    },

    /**
     * Gets UserMeta for chosen UID
     */
    getUserMeta: async (uid) => {
        let doc = await db.collection("user-meta").doc(uid).get();
        return Promise.resolve(doc.data());
    },

    /**
     * Simple Currency Formatter
     * Assumes USD
     */
    currencyFormat: (cents, curr) => {
        console.log(__filename, cents);
        let currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr
        })
        return currency.format( cents/100 );
    },

    /**
     * Estimate the final cost of a job.
     * Actual cost will vary slightly based on various factors.
     *
     * @todo move to a maintained lib like Dinero (https://github.com/sarahdayan/dinero.js)
     */
    estimatedCost: ({ pages }, prefix='$') => {
        return accounting.formatMoney( (30 + (pages * .5) + Math.random() ) , prefix);
    },

    /**
     * Get the value of a job for a Sourcerer
     */
    jobValue: (job, prefix='$') => {
        // User gets 80% of cost.
        return accounting.formatMoney( accounting.unformat(job.estimated_cost_usd) * .80)
    }
}
