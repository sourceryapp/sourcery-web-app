import * as firebaseui from 'firebaseui'

// Make it available to app instance
export default (ctx, inject) => {
    inject('firebaseui', firebaseui);
}
