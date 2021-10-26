// Needed to get the serverHost and serverPort
const globals = require('./globals')

/**
 * Nightwatch
 * @url Setup Guide https://nightwatchjs.org/guide/
 * @url API Reference https://nightwatchjs.org/api/commands/
 */

module.exports = {

    // Set true to disable this test
    disabled: true,

    'Page: /register' (browser) {
        browser
            .url(`http://${globals.serverHost}:${globals.serverPort}/register`)
            .waitForElementVisible('body')
            .setValue("input[name='name']", user.name)
            .setValue("input[name='email']", user.email)
            .setValue("input[name='password']", user.password)
            .setValue("input[name='phone']", user.phone)
            .click("button[type='submit']")
            .end()
    }
}
