// Needed to get the serverHost and serverPort
const globals = require("./globals");


// @url https://github.com/marak/Faker.js/
const faker = require('faker');




/**
 * Nightwatch
 * @url Setup Guide https://nightwatchjs.org/guide/
 * @url API Reference https://nightwatchjs.org/api/commands/
 */

module.exports = {

    // Set true to disable this test
    disabled: false,

    'Page: /create without Credit Card' : function (browser) {
        browser
            // Login
            .login(globals.user.email, globals.user.password)

            // Go to Create Page
            .url(`http://${globals.serverHost}:${globals.serverPort}/request/create`)

            // Type UConn into the search box
            .waitForElementVisible(".ais-SearchBox-input")
            .setValue(".ais-SearchBox-input", "UConn")

            // Make sure the "next" button is still disabled
            .assertDisabled("#next-repo")

            // Choose the correct repo
            .click({
                selector: '//div[text()="Archives and Special Collections"]',
                locateStrategy: 'xpath'
            })

            // Make sure the Next button is now enabled and proceed
            .assertEnabled("#next-repo")
            .click("#next-repo")
            .waitForElementVisible("textarea[name=citation]")

            // Fill out the textarea with 3 characters and make sure the user can't submit
            .setValue("textarea[name=citation]", faker.lorem.text().substr(0,3))
            .assertDisabled("#next-citation")

            // Fill out the required number of characters and go to the next screen
            .setValue("textarea[name=citation]", faker.lorem.text())
            .assertEnabled("#next-citation")
            .click("#next-citation")
            .waitForElementVisible("#pages")

            // Make sure the user can't submit the request until choosing an appropriate number of pages
            .assertDisabled("#submit-request")
            .setValue("#pages", 5)
            .waitForElementVisible("#price")

            // This user doesn't have a CC, so they still can't submit.
            .assertDisabled("#submit-request")

            .end();
    }

            // .click("#submit-request")
            // .waitForElementVisible({
            //     selector: '//h1[text()="Dashboard"]',
            //     locateStrategy: 'xpath'
            // })


}

