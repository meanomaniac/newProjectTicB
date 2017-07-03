//Cryptopia

var request =require('request');
var fs = require('fs');

function cryptopiaTicker () {
  request('https://www.cryptopia.co.nz/api/GetMarkets', function (error, response, body) {
    if (!error && response.statusCode == 200) {
         returnObj = JSON.parse(body);
        var timeNow = new Date();
        for (var i in returnObj.Data) {
          if (returnObj.Data[i] != null && (returnObj.Data[i].Label.indexOf('/BTC') !== -1 || returnObj.Data[i].Label.indexOf('BTC/USDT') !== -1 )) {
         fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/Cryptopia.txt", "symbol: "+returnObj.Data[i].Label+", SP: "+returnObj.Data[i].AskPrice+", time: "+timeNow+", trackingStatus: \n", function(err) {
            if(err) { return console.log(err); }
        });
      }
      }
    }
  });
}

module.exports = cryptopiaTicker;
