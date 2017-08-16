var fs = require('fs');
var writeToDB = require('./writeToDB.js');
var openOrders = require('./openOrders.js');
var orderHistory = require('./orderHistory.js');

var qualifyData = function (exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns) {
  var coinExchange = require('./coinExchange.js');
  var dbArray = [];
  var marketDataArray = [];
  for (var arrayIndex in newTickerObj) {
    var priceDiff, priceChange;
    if (oldTickerObj[arrayIndex] != undefined) {
      priceChange = (newTickerObj[arrayIndex].SPBTC-oldTickerObj[arrayIndex].SPBTC)/oldTickerObj[arrayIndex].SPBTC;
      priceDiff = Math.abs(priceChange);
      newTickerObj[arrayIndex].priceChange = priceChange*100;
      //console.log('price diff: '+priceDiff);
    }
    else {
      //priceDiff = 10000;
      priceDiff = 0; priceChange = 0;
      newTickerObj[arrayIndex].priceChange = priceChange*100;
    }
    //if (oldTickerObj[arrayIndex] == undefined ||  priceDiff > changeThreshold) {
    if (priceDiff > changeThreshold) {
      dbArray.push(newTickerObj[arrayIndex]);
      marketDataArray.push(newTickerObj[arrayIndex].tradePair);
    }
  }
  if (dbArray.length > 0) {
   //console.log('writing ticker to DB:');
   writeToDB('cTicker', exchange, tickerDBColumns, dbArray, -1);
  }

  if (marketDataArray.length > 0) {
    //console.log('writing specifc records to order tables');
    if (exchange != 'coinMarketCap' && exchange != 'coinExchange') {
      openOrders.getOpenOrders(exchange, marketDataArray, -1);
      orderHistory.getOrderHistory(exchange, marketDataArray, -1);
    }
    else if (exchange == 'coinExchange') {
      coinExchange.getOpenOrders(marketDataArray, -1);
      coinExchange.getOrderHistory(marketDataArray, -1);
    }
  }

}

module.exports = qualifyData;
