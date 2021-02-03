/**
 * This is a holdover from a previous version of the app
 * and only exists because it would take forever to refactor
 * the code properly. Basically, this enables DocumentSnapshot
 * objects to use a bunch of added methods defined in the
 * `~/plugins/extensions/request.js` file.
 *
 * TODO Move the extensions/request functionality to a Nuxt plugin
 */
import request from '~/plugins/extensions/request'
export default ({ app }, inject) => {
    app.$fireModule.firestore.DocumentSnapshot.prototype.request = request
}
