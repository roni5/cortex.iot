// load rest of libraries
require('marko/node-require');// allows system to recognize .marko files
const express = require('express');
const markoPress = require('marko/express'); //enable res.marko
const lassoWare = require('lasso/middleware');
const ip = require('ip'); // include ip
const five = require("johnny-five");
var io = require('socket.io')

const {System, statusEmitter, getSystemConfig, deleteSystemConfig} = require(__dirname +'/scr/core/cortex-system.js'); //cortex support components
const hubtemplate = require('./scr/templates/hub/index.marko');
const settingstemplate = require('./scr/templates/settings/index.marko');
const accounttemplate = require('./scr/templates/account/index.marko');
const documentationtemplate = require('./scr/templates/documentation/index.marko');
const feedbacktemplate = require('./scr/templates/feedback/index.marko');

const isProduction = (process.env.NODE_ENV === 'production');

// Configure lasso to control how JS/CSS/etc. is delivered to the browser
require('lasso').configure({
    plugins: [
        'lasso-marko' // Allow Marko templates to be compiled and transported to the browser
    ],
    outputDir: __dirname + '/static', // Place all generated JS/CSS/etc. files into the "static" dir
    bundlingEnabled: isProduction, // Only enable bundling in production
    minify: isProduction, // Only minify JS and CSS code in production
    fingerprintsEnabled: isProduction, // Only add fingerprints to URLs in production
});

const systemIP  = ip.address(); // get systems local ip
const hostIP = '0.0.0.0'; // express needs a blank ip to dynamically define itself
const port = 8080; // define system port
let cortexConfig // create variables to hold cortexConfig as a global

// finished loading system and defining global
statusEmitter.emit('newEvent', "underlying system loaded")
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


new Promise((resolve, reject) => {
    statusEmitter.emit('newEvent', "Initializing cortex system")
    resolve(getSystemConfig);
})
.then((data) => {
    if (!data) {
       throw new Error('no data');
    } else {
      statusEmitter.emit('newEvent', "system configuration loaded")
      // console.log(data);
      cortexConfig = data
    }
})
.catch(() => {
    statusEmitter.emit('newEvent', "Error while loading system configuration")
})
.then(() => {
    statusEmitter.emit('newEvent', "starting secondary system")

    //console.log(cortexConfig);
    const app = express();
    const server = require('http').Server(app); // create http server instance through express

    app.use(markoPress());
    app.use(lassoWare.serveStatic());

    //send home pages to general search
    app.get('/', function (req, res) {
      res.marko(hubtemplate, {
          name: cortexConfig.admin,
      });
      // console.log('search:', req.params.search)
    });

    //test for page via switch
    app.get('/:search', function (req, res) {
      console.log('search:', req.params.search)
      switch (req.params.search) {
        case "settings":
            res.marko(settingstemplate, {
                // name: 'Frank',
            });
          break;
        case "account":
            res.marko(accounttemplate, {
                // name: 'Frank',
            });
          break;
        case "feedback":
            res.marko(feedbacktemplate, {
                // name: 'Frank',
            });
          break;
        case "documentation":
            res.marko(documentationtemplate, {
                // name: 'Frank',
            });
          break;
        default:
          res.status(500).send('You seem to how found a dead end... you should go back!')
      }
    });


    const systemApp  = app.listen(port, hostIP, function () {
      console.log('Server started! Try it out:\nhttp://'+ systemIP +':' + port + '/');
        if (process.send) {
          process.send('online');
        }
    });

    const ioSystem = io(systemApp)
});
