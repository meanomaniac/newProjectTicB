// hitBTC
var request =require('request');
var fs = require('fs');

function hitBTCTicker () {
  request('https://api.hitbtc.com/api/1/public/ticker', function (error, response, body) {
    if (!error && response.statusCode == 200) {
         returnObj = JSON.parse(body);
        var timeNow = new Date();
          for (var i=0; i<Object.keys(returnObj).length; i++) {
          if (returnObj[Object.keys(returnObj)[i]] != null && Object.keys(returnObj)[i].indexOf("BTC") !== -1) {
         fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/hitBTCticker.txt", "symbol: "+Object.keys(returnObj)[i]+", SP: "+returnObj[Object.keys(returnObj)[i]].bid+", time: "+timeNow+", trackingStatus: \n", function(err) {
            if(err) { return console.log(err); }
        });
      }
      }
    }
  });
}

module.exports = hitBTCTicker;
