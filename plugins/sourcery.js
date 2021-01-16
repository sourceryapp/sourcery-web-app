export default (ctx, inject) => {
    // Inject $sourcery in Vue, context and store.
    const sourcery = (() => {
        // firestore, firebase, storage, functions, messaging, etc.
        const { firestore } = ctx.app.$fire
        const user = ctx.store.getters['auth/activeUser']

        // Returns namespaced APIs
        return {
            /**
             * Request
             */
            request: {},

            /**
             * User
             */
            user: {
                /**
                 * user.getMetaData()
                 * Returns an array of metadata for the current user
                 */
                getMetaData: async () => {
                    try {
                        const result = await firestore
                            .collection('user-meta')
                            .doc(user.uid)
                            .get()
                        return result.data()
                    } catch (error) {
                        return {}
                    }
                }
            }
        }
    })()

    inject('sourcery', sourcery)
}
