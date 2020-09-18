/**
 * listens for user login, then updates the
 * user location in the store
 */
import { locationUpdater } from '~/plugins/location-updater'
export const plugins = [ locationUpdater ]


/**
 * Force Strict Mode
 * @url https://vuex.vuejs.org/guide/strict.html
 * @todo Turn on Strict Mode and fix mutation errors
 * @url https://subscription.packtpub.com/book/web_development/9781788999939/2/ch02lvl1sec20/enabling-strict-mode-while-developing
 */
export const strict = false
