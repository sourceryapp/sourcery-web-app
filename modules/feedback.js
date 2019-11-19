import { db } from '~/plugins/firebase-client-init.js'


class Feedback {

    /**
     * Firebase collection in which to store
     * the messages.
     */
    collection = 'feedback';

    /**
     * To: address
     */
    to = 'sourceryapp@gmail.com';

    /**
     * From Address
     */
    from;

    /**
     * Message Subject
     */
    subject = 'Feedback from Tube';

    /**
     * Text/alternate message for when
     * HTML isn't available.
     */
    text;

    /**
     * HTML for the message
     */
    html;

    async send(msg) {

        return await db.collection(this.collection).add({
            to: this.to,
            from: msg.from || null,
            subject: msg.subject || null,
            text: msg.text || null,
            html: msg.html || null,
            date: new Date(),
            referer: process.client ? window.location.href : null,
            userAgent: process.client ? navigator.userAgent : null
        });

    }
}

export default new Feedback();
