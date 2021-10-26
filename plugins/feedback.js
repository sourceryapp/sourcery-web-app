export default ({ app }, inject) => {
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
        console.log('FEEDBQCK', app, this)

        return await app.$fire.firestore.collection(obj.collection).add({
            to: obj.to,
            from: options.from || obj.from,
            subject: options.subject || obj.subject,
            text: options.text || obj.text,
            html: options.html || obj.html,
            date: new Date(),
            referer: process.client ? window.location.href : null,
            userAgent: process.client ? navigator.userAgent : null
        })
    }

    // Inject $feedback in Vue, context and store.
    inject('feedback', obj)
}
