import { db } from '~/plugins/firebase-client-init.js'
import cookieParser from 'cookieparser'
import jwt_decode from 'jwt-decode'
import { type } from 'os';

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
        console.log("getUserMeta", uid)
        let doc = await db.collection("user-meta").doc(uid).get();
        return Promise.resolve(doc.data());
    },

    /**
     * Simple Currency Formatter
     * Assumes USD
     */
    currencyFormat: (cents) => {
        let currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        })
        return currency.format( cents/100 );
    }
}
