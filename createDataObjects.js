var writeToDB = require('./writeToDB.js');

var createTickerObj = function (exchange, tickerObj, label, spVar, timeVar, oldTrackingStatus) {
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
  return tickerObj;
}

var returnCompleteTickerObj = function (tickerObj, oldTickerObj, timeVar) {
  if (tickerObj.USD_BTC == undefined) {
    tickerObj.USD_BTC = {tradePair: 'USD_BTC',
                                SPBTC: cmcUSDBTC,
                                time: timeVar,
                                trackingStatus: -100
                               };
  }
    for (var i=0; i<Object.keys(tickerObj).length; i++) {
      var arrayIndex = Object.keys(tickerObj)[i];
      tickerObj[arrayIndex].SPUSD = tickerObj.USD_BTC.SPBTC * tickerObj[arrayIndex].SPBTC;
    }

  oldTickerObj = tickerObj;
  console.log(tickerObj[Object.keys(tickerObj)[3]].SPBTC);
  console.log(tickerObj.USD_BTC.SPBTC);
  console.log(tickerObj[Object.keys(tickerObj)[3]].SPUSD);
  return tickerObj;
}

function returnopenOrdersObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, recordTime) {
  var dbArray = [];
  openOrdersObj = {
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
  console.log(openOrdersObj);
  //writeToDB('cryptopia', dbArray);
}

function returnHistoryObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, timeNow) {
  var dbArray = [];
  dbArray.push(orderHistoryObj);
  //writeToDB('cryptopia', dbArray);
}

module.exports = {createTickerObj, returnCompleteTickerObj, returnopenOrdersObj, returnHistoryObj};
