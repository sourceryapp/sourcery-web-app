// Needed to get the serverHost and serverPort
const globals = require("./globals");

/**
 * Nightwatch
 * @url Setup Guide https://nightwatchjs.org/guide/
 * @url API Reference https://nightwatchjs.org/api/commands/
 */
module.exports = {

  // Set true to disable this test
  disabled: true,

  'Page: /' : function (browser) {
    browser
      .url(`http://${globals.serverHost}:${globals.serverPort}`)
      .waitForElementVisible('body')
      .assert.titleContains('Sourcery')
      .end();
  }
}
