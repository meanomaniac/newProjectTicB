// Poloniex
var fs = require('fs');
var request =require('request');

function poloniexTicker () {
  request('https://poloniex.com/public?command=returnTicker', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var returnObj = JSON.parse(body);
        var timeNow = new Date();
          for (var i=0; i<Object.keys(returnObj).length; i++) {
          if (returnObj[Object.keys(returnObj)[i]] != null && Object.keys(returnObj)[i].indexOf("BTC") !== -1) {
         fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/Poloniex.txt", "symbol: "+Object.keys(returnObj)[i]+", SP: "+returnObj[Object.keys(returnObj)[i]].lowestAsk+", time: "+timeNow+", trackingStatus: \n", function(err) {
            if(err) { return console.log(err); }
        });
      }
      }
    }
  });
}

module.exports = poloniexTicker;

/*
open orders/order book
https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_NXT
https://poloniex.com/public?command=returnOrderBook&currencyPair=BTC_NXT&depth=10

order history
https://poloniex.com/public?command=returnTradeHistory&currencyPair=BTC_NXT&start=1410158341&end=1410499372

24hour volume for all
https://poloniex.com/public?command=return24hVolume
*/
