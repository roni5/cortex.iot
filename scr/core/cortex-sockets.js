var serverIO = require('socket.io')
const { systemEmitter } = require('./cortex-events.js'); //cortex events / listeners components
const { resetSystemConfig, createNode, recordEvent, getEventRecords, masterDB } = require('./cortex-system.js'); //cortex events / listeners components




///////////////////////////////////////////////////////////////////////////

function socketListener(expressSocket, systemConfig) {
  systemEmitter.emit('newEvent', "connecting socket system...")
  const socket = expressSocket
  var io = serverIO(socket)
  module.exports = { io };
////////////////////////////////////////////////////////////////////////////
// listeners

  // make this a read master history event list - set t number of events
  systemEmitter.on('events-master-stream', (data) => {
    console.log(data);
    io.sockets.emit("events-master-stream", data)
    // systemEmitter.emit('sensor-socket-update', data)
  })

  //listen for updates from event stream
  systemEmitter.on('thermometerData-update-socket', (data) => {
    // console.log(data);
    io.sockets.emit('thermometerData-update', data)
  })

  // ADD: listen for setting changes and broadcast them

///////////////////////////////////////////////////////////////////////////////

  io.on('connection', function(socket){
      console.log('a user connected');
      // send current systemConfig used to lauch this system
      // socket.emit("systemConfig", systemConfig )

      // reset system config to template - application
      socket.on('delete-system-config', () => {
         console.log("request to delete systemConfig");
        resetSystemConfig()
      })
      // save node to masterDB
      // ADD: option as update
      socket.on("save-new-node", (data) => {
        createNode(data)
      })

      // ADD: save-new-device + update option
      // ADD: save - general settings + update option
      // get last data save
      // get all device history

      // over ride relay state - select target
      socket.on('relay-overRide', (target) => {
          // console.log("overRiding "+ target);
          var emitName = `relay-state-${target}`
          // console.log(emitName);
          systemEmitter.emit(emitName, "overRide")
      })
      // save a new event record
      socket.on("save-event-record", (data) => {
        // socket.broadcast.emit('update-event-records', data)
        // console.log(data);
        recordEvent(data)
        // var eventBundle = data
        // systemEmitter.emit('newEvent', "Saved New Event Record")
        // io.emit("update-event-record", eventBundle )
      });
      // return event record
      socket.on("event-record-request", () => {
         let eventRecords = getEventRecords()
         socket.emit("event-record-list", eventRecords)
      })
      // return soc
      socket.on("event-record-request", () => {
         let eventRecords = getEventRecords()
         socket.emit("event-record-list", eventRecords)
      })
      // return history for target device (add options)
      socket.on("target-device-history", (target) => {
        // console.log(target);
        // var bundle = "data"
        masterDB.get(target).catch(function (err) {
              if (err.name === 'not_found') {
                console.log("no record found, sorry");
              } else { // hm, some other error
                throw err;
              }
            }).then(function (doc) {
              // console.log(doc);
              return  socket.emit("target-device-history-data", doc )
            }).catch(function (err) {
              // handle any errors
            });;
      })
      // return all device history
      socket.on("all-devices-history", (stepCount) => {
        // get all datat from all active devices
        // parse said objects for their data
        // put data per object into bundledData
        // put labels from time stamps

        var preProccessorContainer = []

        var labelArray = []
        var bunndledDataSets = []

        var containerDataSetLengths=[]

        masterDB.allDocs({
          include_docs: true,
          attachments: true
        }).then(function (result) {
          // handle result
          var allDocs = result.rows

          // for all docs check each on
          for (var i = 0; i < allDocs.length; i++) {
            var dataArray = allDocs[i].doc.data

            // var dataArrayLength = dataArray.length
            // console.log(dataArrayLength);

            // if doc is system config ignore
            if (allDocs[i].id === systemConfig) {
              return
            } else { // push data to new array
               preProccessorContainer.push(dataArray)
               // containerDataSetLengths.push(dataArrayLength)
            }
          }

          // for each doc in container
          var preProccessorContainerLength = allDocs.length-1
          for (var i = 0; i < preProccessorContainerLength; i++) {
            // array of all data in said doc
            var dataSetArray = []
            var prelabelArray= []
            var postData = []
            //
            // var dataSetTemplate = dataSetArray
            //   data: dataSetArray
            // }

            // let current = preProccessorContainer[i]
            // console.log(currentLength);
            // let currentLength= current.length

            //for each doc get data
            for (var y = 0; y < preProccessorContainer[i].length; y++) {
              // for each docs dataSet get # of stepCount
                  var currentData = preProccessorContainer[i][y].data
                  var currentTimeStamp = preProccessorContainer[i][y].timeStamp
                  // console.log(preProccessorContainer[i][y]);
                  dataSetArray.push(currentData)
                  prelabelArray.push(currentTimeStamp)
            }


            for (var z = 0; z < stepCount; z++) {
              labelArray.push(prelabelArray[z])
            }


            for (var z = 0; z < stepCount; z++) {
              postData.push(dataSetArray[z])
            }

            bunndledDataSets.push(postData)
          }


            var bundledChartData = {label: labelArray , dataSets: bunndledDataSets}

            socket.emit("all-devices-history-data",  bundledChartData)

          // console.log(bundledChartData);


        }).catch(function (err) {
          console.log(err);
        });

      })
      // on socket disconnect
      socket.on('disconnect', function(){
        console.log('user disconnected');
        // disconnect service
        socket.disconnect(true)
      });
  });
  systemEmitter.emit('newEvent', "socket connected")
}// end of socketListener


module.exports = { socketListener};
