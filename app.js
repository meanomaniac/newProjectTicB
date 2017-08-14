
var fs = require('fs');
var coinExchange = require('./coinExchange.js');
var stdGetPublicData = require('./stdGetPublicData.js');
var stdGetPublicData2 = require('./stdGetPublicData2.js');
var exchangeList = ['coinMarketCap', 'bittrex', 'livecoin', 'cryptopia', 'novaexchange', 'hitBTC', 'yoBit', 'poloniex', 'coinExchange'];
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

function writeAllQualifiedMarketsToDB (timeGap, changeThreshold) {
  var coinMarketCapObj = {}, bittrexObj = {}, livecoinObj = {}, cryptopiaObj = {}, novaexchangeObj = {},
  hitBTCObj = {}, yoBitObj = {}, poloniexObj = {}, coinExchangeObj = {};
  var exchangeObjs = [coinMarketCapObj, bittrexObj, livecoinObj, cryptopiaObj, novaexchangeObj, hitBTCObj, yoBitObj, poloniexObj, coinExchangeObj];
  setIntervalSynchronous (function (exchangeObjs, changeThreshold) {
    getAllMarketInfo (exchangeObjs, changeThreshold);}, timeGap);
}

function getAllMarketInfo (exchangeObjs, changeThreshold) {
  for (var i=0; i<exchangeList.length; i++) {
    switch (exchangeList[i]) {
      case 'cryptopia':
      case 'hitBTC':
      case 'livecoin':
      case 'poloniex':
      case 'novaexchange':
      case 'coinMarketCap':
        exchangeObjs[i] = stdGetPublicData.ticker(exchangeList[i], exchangeObjs[i], changeThreshold, tickerDBColumns); break;
      case 'yoBit':
      case 'bittrex':
        exchangeObjs[i] = stdGetPublicData2.getAllMarkets(exchangeList[i], exchangeObjs[i], changeThreshold, tickerDBColumns); break
      case 'coinExchange':
        exchangeObjs[i] = coinExchange.coinExchangeMarkets(exchangeObjs[i], changeThreshold, tickerDBColumns); break;
      default:
        break;
    }
  }
 }
