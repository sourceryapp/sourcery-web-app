import { db } from '~/plugins/firebase-client-init.js'
import cookieParser from 'cookieparser'
import jwt_decode from 'jwt-decode'

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
    buildQueryString: params => Object.keys(params).map(key => key + '=' + params[key]).join('&'),

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

    /**
     * Gets UserMeta for chosen UID
     */
    getUserMeta: async (uid) => {
        console.log("getUserMeta", uid)
        let doc = await db.collection("user-meta").doc(uid).get();
        return doc.data();
    }

}
