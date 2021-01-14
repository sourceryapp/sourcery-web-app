const globals = require('../globals')

const load_speed = 5000

exports.command = function (username, password) {
    this
        .url(`http://${globals.serverHost}:${globals.serverPort}/login`)
        .waitForElementVisible('body')
        .setValue("input[name='email']", globals.user.email)
        .setValue("input[name='password']", globals.user.password)
        .click("button[type='submit']")
        .waitForElementVisible({
            selector: '//h1[text()="Dashboard"]',
            locateStrategy: 'xpath'
        })

    return this
}
