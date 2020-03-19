var PouchDB = require('pouchdb');
const {systemEmitter} = require('./cortex.emitter'); // systemEmitter functionality
const {systemSettings, currentConnectedSensorList} = require('../../config/systemConfig.js'); // systemConfigs
const {localTime} = require('../utility/utility.js'); // local time for event triggers

// create database for eventstream
var eventHistoryDB = new PouchDB('eventHistory');
// last time frame requested
addToEventStreamDB = (data) => {

    eventHistoryDB.get('eventHistory').catch(function (err) {
    if (err.name === 'not_found') {
      return eventHistoryDB.put({
        _id: 'eventHistory',
        data: ['data']
      });
    } else { // hm, some other error
      throw systemEmitter.emit('newEvent', 'io' , 'ERROR', localTime(systemSettings.utcOffSet), 'ERROR', `${err}`);
    }
  }).then(function (eventHistoryDoc) {
    // sweet, here is our eventHistoryDoc

    //define eventHistory.data
    dataTarget = eventHistoryDoc.data;
    //push data to target
    dataTarget.push(data);

    // console.log(eventHistoryDoc);

    //database put doc back
    eventHistoryDB.put(eventHistoryDoc);
    // finish
    return console.log('worked');
  }).catch(function (err) {
    // handle any errors
    throw systemEmitter.emit('newEvent', 'io' , 'ERROR', localTime(systemSettings.utcOffSet), 'ERROR', `${err}`);
  });
    // finish
  return console.log('done');

}

// TODO: GET addToEventStreamDB data
// todo: download dump event history

// create database for eventstream
var devicetHistoryDB = new PouchDB('deviceHistory');
// last time frame requested
addToDeviceHistoryDB = (target , dataBundle) => {

    devicetHistoryDB.get(target).catch(function (err) {
    if (err.name === 'not_found') {
      return devicetHistoryDB.put({
        _id: target,
        data: [dataBundle]
      });
    } else { // hm, some other error
      throw err;
    }
  }).then(function (devicetHistoryDoc) {
    // sweet, here is our eventHistoryDoc

    //define eventHistory.data
    dataTarget = devicetHistoryDoc.data;
    //push data to target
    dataTarget.push(dataBundle);

    console.log(devicetHistoryDoc);

    //database put doc back
    devicetHistoryDB.put(devicetHistoryDoc);
    // finish
    return console.log('worked');
  }).catch(function (err) {
    // handle any errors
    console.log(err);
  });

    // finish
  return console.log('done');

}

getDeviceHistoryData = async (target, recordCount) => {

  var output = devicetHistoryDB.get(target).catch(function (err) {
      if (err.name === 'not_found') {
        return systemEmitter.emit('newEvent', 'io' , 'MINOR ERROR', localTime(systemSettings.utcOffSet), 'ERROR', `System tried to save data to a device which has not be configured`)
      } else { // hm, some other error
        throw systemEmitter.emit('newEvent', 'io' , 'ERROR', localTime(systemSettings.utcOffSet), 'ERROR', `${err}`);
      }
  }).then(function (devicetHistoryDoc) {

        // get the last X number of records requested
        function optionTest(recordCount){
          switch (recordCount) {
             case 'all':
                   //get complete history for target device
               break;
             default:

               //assign data to variable
               deviceData = devicetHistoryDoc.data
               //slice/copy range into output variable

              // declare and copy requested # of records
              var newData = deviceData.slice(1).slice(-recordCount)
              var outPutData = []

              newData.forEach((item, i) => {

                  // shape of data
                 //{data: data, eventTriggerDate: eventTriggerDate, status: status, detail: detail}



              });

              // console.log(newData);
               return newData


           }
        }
        var preOutPut = optionTest(recordCount);
        // console.log(preOutPut);

        return preOutPut ;
  }).catch(function (err) {
      // handle any errors
      console.log(err);
    });

  // console.log(output);

  // ouput the select data range
  return output

}

//get all currentConnectedSensorList data for define time step count

getDeviceBankHistory = async (recordCount) => {

  var output = devicetHistoryDB.allDocs({include_docs:true, limit:recordCount}, (err,response) => {
    // console.log();
    //assign the rows arrays
    let rows = response.rows
    var preOutPut = []

    rows.forEach((item, i) => {
        var targetID = item.id
        var preDataBundle = item.doc.data
        var dataBundle = []
        preDataBundle.forEach((item, i) => {
          dataBundle.push(item.data)
        });
        // console.log(dataBundle);
        return preOutPut.push(dataBundle);
    });
    return preOutPut;
  })
  return output;
}


getDeviceBankHistory(10).then( (data) => {
  console.log(data);
})

// addToEventStreamDB('data')
module.exports = {addToEventStreamDB, addToDeviceHistoryDB, getDeviceHistoryData, getDeviceBankHistory};
