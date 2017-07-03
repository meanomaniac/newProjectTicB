// Livecoin -
var fs = require('fs');
var request =require('request');

function livecoinTicker () {
  request('https://api.livecoin.net/exchange/ticker', function (error, response, body) {
    if (!error && response.statusCode == 200) {
         returnObj = JSON.parse(body);
        var timeNow = new Date();
        for (var i in returnObj) {
          if (returnObj[i].symbol.indexOf('/BTC') !== -1 || returnObj[i].symbol.indexOf('BTC/USD') !== -1 ) {
           fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/Livecoin.txt", "symbol: "+returnObj[i].symbol+", SP: "+returnObj[i].best_ask+", time: "+timeNow+", trackingStatus: \n", function(err) {
              if(err) { return console.log(err); }
          });
        }
      }
    }
  });
}

module.exports = livecoinTicker;
