/**
 * Wrapper for standardizing filesize usage in the app
 * @url https://github.com/avoidwork/filesize.js
 */
import filesize from 'filesize'

export default ({ app }, inject) => {
    // Inject $filesize() in Vue, context and store.
    inject('filesize', size => filesize(size, {
        base: 2
    }))
}
