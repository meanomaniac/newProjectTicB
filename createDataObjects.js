var writeToDB = require('./writeToDB.js'), fs = require('fs'),
openOrdersDBColumns = ['exchangeName', 'tradePair', 'maxBuy', 'minBuy', 'totalBuys', 'totalBuyAmount', 'maxSell', 'minSell', 'totalSells', 'totalSellAmount', 'recordTime'],
orderHistoryDBColumns = ['exchangeName', 'tradePair', 'maxBuy', 'minBuy', 'totalBuys', 'totalBuyAmount', 'maxSell', 'minSell', 'totalSells', 'totalSellAmount', 'recordTime'],
cmcUSDBTC;

var createTickerObj = function (exchange, tickerObj, label, spVar, timeVar, oldTrackingStatus, usdBtc) {
  var objProperty = label;
  if ((label.toUpperCase().indexOf('BTC') !== -1) && ((label.toUpperCase().indexOf('USD') !== -1) || (label.toUpperCase().indexOf('USA') !== -1))) {
      objProperty = 'USD_BTC';
    if (exchange == 'coinMarketCap') {
      cmcUSDBTC = spVar;
    }
  }
  tickerObj[objProperty] = {tradePair: label,
                              SPBTC: spVar,
                              time: timeVar,
                              trackingStatus: (oldTrackingStatus + 1)
                             }
  if (usdBtc && usdBtc.SPBTC) {
    tickerObj[objProperty].SPUSD = usdBtc.SPBTC * tickerObj[objProperty].SPBTC;
  }
  return tickerObj;
}

var returnCompleteTickerObj = function (tickerObj, oldTickerObj, timeVar) {
  if (!tickerObj.USD_BTC) {
    tickerObj.USD_BTC = {tradePair: 'USD_BTC',
                                SPBTC: cmcUSDBTC,
                                time: timeVar,
                                trackingStatus: -100
                               };
  }
    for (var arrayIndex in tickerObj) {
      tickerObj[arrayIndex].SPUSD = tickerObj.USD_BTC.SPBTC * tickerObj[arrayIndex].SPBTC;
    }
  return tickerObj;
}

function returnopenOrdersObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, recordTime) {
  var dbArray = [];
  var openOrdersObj = {
    'exchange': exchange,
    'tradePair': tradePair,
    'maxBuy': maxBuy,
    'minBuy': minBuy,
    'totalBuys': totalBuys,
    'totalBuyAmount': totalBuyAmount,
    'maxSell': maxSell,
    'minSell': minSell,
    'totalSells': totalSells,
    'totalSellAmount': totalSellAmount,
    'recordTime': recordTime
  };
  dbArray.push(openOrdersObj);
  writeToDB('openOrders', exchange, openOrdersDBColumns, dbArray, -1);
  //writeToDB('openOrdersTest', exchange, openOrdersDBColumns, dbArray, -1);
}

function returnHistoryObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, recordTime) {
  var dbArray = [];
  orderHistoryObj = {
    'exchange': exchange,
    'tradePair': tradePair,
    'maxBuy': maxBuy,
    'minBuy': minBuy,
    'totalBuys': totalBuys,
    'totalBuyAmount': totalBuyAmount,
    'maxSell': maxSell,
    'minSell': minSell,
    'totalSells': totalSells,
    'totalSellAmount': totalSellAmount,
    'recordTime': recordTime
  };
  dbArray.push(orderHistoryObj);
  writeToDB('orderHistory', exchange, orderHistoryDBColumns, dbArray, -1);
  //writeToDB('orderHistoryTest', exchange, orderHistoryDBColumns, dbArray, -1);
}

module.exports = {createTickerObj, returnCompleteTickerObj, returnopenOrdersObj, returnHistoryObj};
