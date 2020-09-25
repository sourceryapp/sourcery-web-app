exports.command = function(selector) {
    this
        .getAttribute(selector,'disabled',function(result){
            // Not disabled
            this.assert.equal(result.value, null, `${selector} is enabled.`)
        })
    return this;
}
