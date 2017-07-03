// Novaexchange - no USD reference here ????????????????????????????????????????????????????????????????
var fs = require('fs');
var request =require('request');

function novaexchangeTicker () {
  request('https://novaexchange.com/remote/v2/markets/', function (error, response, body) {
    if (!error && response.statusCode == 200) {
         returnObj = JSON.parse(body);
        var timeNow = new Date();
        for (var i in returnObj.markets) {
          if (returnObj.markets[i] != null && (returnObj.markets[i].marketname.indexOf('BTC_') !== -1 || returnObj.markets[i].marketname.indexOf('_BTC') !== -1)) {
         fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/Novaexchange.txt", "symbol: "+returnObj.markets[i].marketname+", SP: "+returnObj.markets[i].ask+", time: "+timeNow+", trackingStatus: \n", function(err) {
            if(err) { return console.log(err); }
        });
      }
      }
    }
  });
}

module.exports = novaexchangeTicker;
