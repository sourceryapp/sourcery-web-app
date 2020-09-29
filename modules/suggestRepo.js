import { db } from '~/plugins/firebase-client-init.js'

class suggestRepo {

    /**
     * Firebase collection in which to store
     * the messages.
     */
    collection = 'suggestRepo';

    /**
     * To: address
     */
    to = 'research.tube.app@gmail.com';

    /**
     * From Address
     */
    from;

    /**
     * Message Subject
     */
    subject = 'Repository Suggestion';

    /**
     * Text/alternate message for when
     * HTML isn't available.
     */
    text;

    /**
     * HTML for the message
     */
    html;

    /**
     * Suggestion Info
     */

     name;
     city;
     institution;
     address;
     country;

    async send(msg) {

        return await db.collection(this.collection).add({
            to: this.to,
            from: msg.from || null,

            name: msg.name || null,
            city: msg.city || null,
            institution: msg.institution || null,
            address: msg.address || null,
            country: msg.country || null,

            date: new Date(),
            referer: process.client ? window.location.href : null,
            userAgent: process.client ? navigator.userAgent : null
        });

    }
}

export default new suggestRepo();