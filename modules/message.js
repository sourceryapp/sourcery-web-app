import { db } from '~/plugins/firebase-client-init.js'


class Message {

    /**
     * Firebase collection in which to store
     * the messages.
     */
    collection = 'messages';

    /**
     * To: address
     */
    to;

    /**
     * From Address
     */
    from = 'research.tube.app@gmail.com';

    /**
     * Message Subject
     */
    subject;

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
            to: msg.to || null,
            from: msg.from || this.from,
            subject: msg.subject || null,
            text: msg.text || null,
            html: msg.html || null
        });

    }
}

let Mail;
export default Mail = new Message();
