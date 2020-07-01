// Compiled using marko@4.18.48 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    marko_componentType = "/cortex.iot$0.0.40/components/app-analytics-device-sensor-metrics/index.marko",
    marko_renderer = require("marko/src/runtime/components/renderer");

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<div id=\"deviceAnalyticsReportingContainer\"><button id=\"timeFrame_now\">Now</button> Delta Change: <span id=\"timeFrame_deltaChange\"></span> <br> Time-Frame avrg: <span id=\"timeFrame_timeFrameAvrg\"></span> <br></div><script>\n\n    //get target container for ui bindings\n    var deviceAnalyticsReportingContainer = document.querySelectorAll(\"div.deviceAnalyticsReportingContainer\");\n\n    //calculate the mean of an array\n    // pipe raw dataset without doc\n    calculatePresets = (dataBundle) => {\n        // console.log('hi');\n        //create data object\n        dataOBJ = {\n          x: [],\n          y: [],\n          xLength: null,\n          yLength: null,\n          firstDataPoint: {x:null,y:null},\n          lastDataPoint: {x:null,y:null},\n        }\n\n        let x = dataOBJ.x\n        let y = dataOBJ.y\n\n        dataBundle.forEach((item, i) => {\n          // console.log(item.data);\n          y.push(item.data);\n          x.push(item.eventTriggerDate)\n        });\n\n        // testLength of data set\n        dataOBJ.xLength = x.length\n        dataOBJ.yLength = y.length\n\n\n        //get first and last datapoint\n        dataOBJ.firstDataPoint.x = x[0]\n        dataOBJ.firstDataPoint.y = y[0]\n\n\n        dataOBJ.lastDataPoint.x = x[dataOBJ.xLength-1]\n        dataOBJ.lastDataPoint.y = y[dataOBJ.yLength-1]\n\n        return dataOBJ;\n\n    };\n\n    //once global veriable is availible run\n    window.onload =  () => {\n    //get data doc from global scope and select down to data then run preset funtion\n    targetDeviceDataSet = calculatePresets(targetUIDDBDoc.doc.data)\n    // console.log(targetDeviceDataSet);\n\n////////////////////////////////////////////////////////////////////////////////\n\n    //   {x: Array(669), y: Array(669), xLength: 669, yLength: 669, firstDataPoint: {…}, …}\n    //   firstDataPoint: {x: \"2020-06-30 15:57:22\", y: 101}\n    //   lastDataPoint: {x: \"2020-07-01 16:37:20\", y: 101}\n    //   x: (669) [\"2020-06-30 15:57:22\", \"2020-06-30 15:57:27\", \"2020-06-30 15:57:32\", \"2020-06-30 15:57:37\", \"2020-06-30 15:57:42\", \"2020-06-30 15:57:47\", \"2020-06-30 15:57:52\", \"2020-06-30 15:57:57\", \"2020-06-30 15:58:02\", \"2020-06-30 15:58:07\", \"2020-06-30 15:58:12\", \"2020-06-30 15:58:17\", \"2020-06-30 15:58:22\", \"2020-06-30 15:58:27\", \"2020-06-30 15:58:32\", \"2020-06-30 15:58:37\", \"2020-06-30 15:58:42\", \"2020-06-30 15:58:47\", \"2020-06-30 15:58:52\", \"2020-06-30 15:58:57\", \"2020-06-30 15:59:02\", \"2020-06-30 15:59:07\", \"2020-06-30 16:05:54\", \"2020-06-30 16:05:59\", \"2020-06-30 16:06:04\", \"2020-06-30 16:06:09\", \"2020-06-30 16:06:14\", \"2020-06-30 16:06:19\", \"2020-06-30 16:06:24\", \"2020-06-30 16:06:29\", \"2020-06-30 16:06:34\", …]\n    //   xLength: 669\n    //   y: (669) [101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 102, 102, 101, 101, 101, 101, 101, 102, 101, 101, 101, 101, 101, 102, 101, 101, 101, 101, 101, 102, 102, 102, 101, 101, 101, 101, 100, 101, 101, 101, 100, 100, 101, 101, 101, 100, 101, 101, 101, 101, 101, 101, 101, 100, 100, 100, 100, 101, 101, 101, 101, 101, 101, 100, 101, 100, 100, 101, 101, 101, 101, 101, 101, 101, 101, 101, 101, 100, 100, 100, 100, 101, …]\n    //   yLength: 669\n\n////////////////////////////////////////////////////////////////////////////////\n\n\n      //calculte mean of dataset in targetDeviceDataSet.y where x is a date\n      meanOutput = setMean(targetDeviceDataSet.y)\n      // var meanOutPutDOM = document.querySelector(\"div.deviceAnalyticsReportingContainer span#timeFrame_timeFrameAvrg\");\n      var meanOutPutDOM = document.querySelector(\"span#timeFrame_timeFrameAvrg\");\n      meanOutPutDOM.innerHTML = meanOutput\n      console.log(meanOutPutDOM);\n\n      //calculate change between the first and last datapoint y where x is a date\n      deltaChangeOutput = deltaChange(targetDeviceDataSet.firstDataPoint.y, targetDeviceDataSet.lastDataPoint.y);\n      var deltaChangetDOM = document.querySelector(\"span#timeFrame_deltaChange\");\n      deltaChangetDOM.innerHTML = deltaChangeOutput\n      console.log(deltaChangetDOM);\n\n\n\n    }\n\n\n\n</script>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.meta = {
    deps: [
      "./style.css"
    ],
    id: "/cortex.iot$0.0.40/components/app-analytics-device-sensor-metrics/index.marko"
  };
