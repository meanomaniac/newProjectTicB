
var fs = require('fs');
var coinExchange = require('./coinExchange.js');
var stdGetPublicData = require('./stdGetPublicData.js');
var stdGetPublicData2 = require('./stdGetPublicData2.js');
var tickerDBColumns = ['exchangeName', 'tradePair', 'askPriceUSD', 'askPriceBTC', 'recordTime', 'trackingStatus'];
var thirtySecThreshold = 0.1,
fiveMinThreshold = 0.0001;
var cmcUSDBTC;


var setIntervalSynchronous = function (func, delay) {
  var intervalFunction, timeoutId, clear;
  // Call to clear the interval.
  clear = function () {
    clearTimeout(timeoutId);
  };
  intervalFunction = function () {
    func();
    timeoutId = setTimeout(intervalFunction, delay);
  }
  // Delay start.
  timeoutId = setTimeout(intervalFunction, delay);
  // You should capture the returned function for clearing.
  return clear;
};

// writeAllQualifiedMarketsToDB (30000, thirtySecThreshold);
// writeAllQualifiedMarketsToDB (300000, fiveMinThreshold);

function returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, functionIteration) {
  functionIteration++;
  // use functionIteration to loop through all exchangeObjs and perform the following
  // cryptopia.ticker(cryptopia, exchangeObjs.cryptopia, changeThreshold);
  newTickerObj = exchange();

  // got to the next exchange by recursively calling the same function itself like below
  if (functionIteration < (exchanges.length -1)) {
    returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, functionIteration);
  }
}

function writeAllQualifiedMarketsToDB (timeGap, changeThreshold) {
  var coinMarketCapObj, bittrexObj, livecoinObj, cryptopiaObj, novaexchangeObj, hitBTCObj, yoBitObj, poloniexObj, coinExchangeObj;
  var exchangeObjs = [coinMarketCapObj, bittrexObj, livecoinObj, cryptopiaObj, novaexchangeObj, hitBTCObj, yoBitObj, poloniexObj, coinExchangeObj];
  setIntervalSynchronous (function (exchangeObjs, changeThreshold, marketsWritableToDB) {
    returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, -1);}, timeGap);
}

// stdGetPublicData.ticker('cryptopia', {}, 0.1, tickerDBColumns);
// stdGetPublicData2.getAllMarkets('yoBit', {}, 0.1, tickerDBColumns);
// coinExchange.coinExchangeMarkets({}, 0.1, tickerDBColumns);
