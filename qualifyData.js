var fs = require('fs');
var writeToDB = require('./writeToDB.js');

var qualifyData = function (exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns) {
  var dbArray = [];
  var cryptopia = require('./tickerFiles/cryptopia.js');
  var marketDataArray = [];
  for (var i=0; i<Object.keys(newTickerObj).length; i++) {
    var arrayIndex = Object.keys(newTickerObj)[i];
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
      //  console.log('trade pair '+newTickerObj[arrayIndex].tradePair+' added');
        marketDataArray.push(newTickerObj[arrayIndex].tradePair);
      }
      // result[0][Object.keys(result[0])[2]]
    }
  }
  if (dbArray.length > 0) {
    /*
    fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/ticker2/Cryptopia3.txt", " "+JSON.stringify(dbArray), function(err) {
       if(err) { return console.log(err); }
   });
   */
   console.log('writing ticker to DB:');
   writeToDB('cTicker', exchange, tickerDBColumns, dbArray, -1);
  }

var exchangeObj;
switch (exchange) {
  case 'cryptopia':
    exchangeObj = cryptopia;
    break;
  default:
    break;
}
  // console.log('data array for order history: ')
  // console.log(marketDataArray);

  if (marketDataArray.length > 0) {
      console.log('writing specifc records to order tables');
     exchangeObj.openOrders(marketDataArray, -1);
     exchangeObj.orderHistory(marketDataArray, -1);
  }
}

module.exports = qualifyData;