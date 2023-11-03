'use strict'

// A Tropy plugin is a regular Node.js module. Because of the way the plugin
// is loaded into Tropy this has to be a CommonJS module. You can use `require`
// to access the Node.js and Electron APIs or any files bundled with your plugin.

class SourceryTropyPlugin {

  // A Tropy plugin is JavaScript class/constructor function. An instance will be
  // created at start-up in each project window for each set of `options` configured
  // in the plugin section of Tropy's preferences window.
  constructor(options, context) {

    // It is good practice to define a default configuration to use as a fallback
    // in case some options are left blank.
    this.options = Object.assign({}, SourceryTropyPlugin.defaults, options)

    // The plugin instance receives a `context` object from Tropy. Typically,
    // you will store a reference here, so that you can use it later when a
    // hook is triggered.
    this.context = context

    // The sample plugin just prints the constructor arguments to the console
    // for instructional purposes. You can see it in Tropy if you reload the
    // project window while the DevTools are open.
    console.log('Constructed example plugin with options and context:')
    console.log(this.options)
    console.log(this.context)
  }

  // This method gets called when the import hook is triggered.
  async import(payload) {
    console.log('here')
    console.log(payload)
    this.logger.trace('Called import hook from example plugin')

    // This logs the payload received by the import hook. After this method
    // completes, Tropy's import command will continue its work with this
    // payload.
    console.log(payload)

    // After this method completes, Tropy's import command will continue its
    // work with this payload. To have Tropy import JSON-LD data, you can
    // add it here:
    payload.data = [
      // Add your items here!
    ]

    // Alternatively, to import a list of supported local files or remote
    // URLs you can add the respective arrays instead:
    //
    // payload.files = []
    // payload.urls = []
  }
}

SourceryTropyPlugin.defaults = {}

// The plugin must be the module's default export.
module.exports = SourceryTropyPlugin
