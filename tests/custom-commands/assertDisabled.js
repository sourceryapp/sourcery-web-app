exports.command = function (selector) {
    this
        .getAttribute(selector, 'disabled', function (result) {
            // Is disabled
            this.assert.equal(result.value, 'true', `${selector} is disabled.`)
        })
    return this
}
