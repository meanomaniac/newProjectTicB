var fs = require('fs');
var writeToDB = require('./writeToDB.js');

var qualifyData = function (exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns) {
  var dbArray = [];
  for (var i=0; i<Object.keys(newTickerObj).length; i++) {
    var arrayIndex = Object.keys(newTickerObj)[i];
    var marketDataArray = [];
    var priceDiff;
    if (oldTickerObj[arrayIndex] != undefined) {
      priceDiff = Math.abs((newTickerObj[arrayIndex].SPBTC-oldTickerObj[arrayIndex].SPBTC)/oldTickerObj[arrayIndex].SPBTC);
    }
    else {
      priceDiff = 10000;
    }
    if (oldTickerObj[arrayIndex] == undefined ||  priceDiff > changeThreshold) {
      dbArray.push(newTickerObj[arrayIndex]);
      if (changeThreshold >= 0.1) {
        marketDataArray.push(newTickerObj[arrayIndex].tradePair);
      }
      // result[0][Object.keys(result[0])[2]]
    }
  }
  if (dbArray.length > 0) {
    fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/ticker2/Cryptopia3.txt", " "+JSON.stringify(dbArray), function(err) {
       if(err) { return console.log(err); }
   });
   writeToDB('cTicker', exchange, tickerDBColumns, dbArray);
  }
  if (marketDataArray.length > 0) {
    // exchange.openOrders(marketDataArray, -1);
    // exchange.orderHistory(marketDataArray, -1);
  }
}

module.exports = qualifyData;
