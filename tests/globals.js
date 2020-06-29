const resolve = require('path').resolve;
const Nuxt = require('nuxt').Nuxt;
const Builder = require('nuxt').Builder;

/**
 * Nightwatch
 * @url https://nightwatchjs.org/guide/
 */

// Used to store the nuxt server instance
let nuxtInstance = null;

module.exports = {

    // The host for nuxt server
    serverHost: 'localhost',

    // Which port to run nuxt on
    serverPort: 5555,

    // Temporary User
    user: {
        name: "Nightwatch Testrunner",
        email: "brian+nightwatch@uconn.edu",
        password: "123456789!",
        phone: "8605555555"
    },

    before : async function(browser, done) {
        console.log("Starting Nuxt Server")
        const rootDir = resolve(__dirname, '../')
        let config = {}
        try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
        config.rootDir = rootDir // project folder
        const nuxt = new Nuxt(config)
        nuxtInstance = nuxt // We keep a reference to Nuxt so we can close the server at the end of the test
        await new Builder(nuxt).build()
        await nuxt.server.listen(this.serverPort, this.serverHost)
        done();
    },

    after : async function(browser, done) {
        console.log('Shutting Down Nuxt');
        await nuxtInstance.close();
        done();
    },
}
