export default ({ app }, inject) => {
    // Inject $feedback() in Vue, context and store.
    inject('feedback', () => {
        const obj = {
            /**
             * Firebase collection in which to store
             * the messages.
             */
            collection: 'feedback',

            /**
             * To: address
             */
            to: 'support@sourceryapp.org',

            /**
             * From Address
             */
            from: 'noreply@sourceryapp.org',

            /**
             * Message Subject
             */
            subject: 'Feedback from Sourcery App',

            /**
             * Text/alternate message for when
             * HTML isn't available.
             */
            text: null,

            /**
             * HTML for the message
             */
            html: null
        }
        obj.send = async (options) => {
            return await app.$fire.firestore.collection(this.collection).add({
                to: this.to,
                from: options.from || this.from,
                subject: options.subject || this.subject,
                text: options.text || this.text,
                html: options.html || this.html,
                date: new Date(),
                referer: process.client ? window.location.href : null,
                userAgent: process.client ? navigator.userAgent : null
            })
        }
        return obj
    })
}
