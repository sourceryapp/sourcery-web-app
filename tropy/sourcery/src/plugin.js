'use strict'

const path = require('path');
const fs = require('fs');

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

    // Tropy context dialog to open a file selection window.
    this.dialog = context.dialog.show
  }

  // This method gets called when the import hook is triggered.
  async import(payload) {

    // Allow the user to select a json-ld file.  The filter doesn't currently work on the Tropy wrapper... needs more testing.
    var selected = await this.dialog('file', {
      properties: ['openFile'],
      filters: [{
        name: 'Sourcery Import Files',
        extensions: ['jsonld']
      }]
    })

    // Take the JSONLD file and replace the item paths with absolute paths.
    if ( selected && selected.length ) {
      const filePath = selected[0];
      const ext = path.extname(filePath);
      if (ext === '.jsonld') {
        const dir = path.dirname(filePath);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const fileJSON = JSON.parse(fileContents);
        const uploadItems = fileJSON['@graph'][0]['photo'];
        for (let index = 0; index < uploadItems.length; index++) {
          fileJSON['@graph'][0]['photo'][index]['path'] = path.join(dir, fileJSON['@graph'][0]['photo'][index]['path'].replace('./sourcery', ''));
        }

        // As long as we assign payload.data with JSON-LD structure, it will pass it to the native importer.
        payload.data = [fileJSON];
      }
      
    }

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
