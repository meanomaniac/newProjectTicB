/*
The setIntervalSynchronous function allows the execution of setInterval in a synchronous way (https://gist.github.com/AndersDJohnson/4385908)
*/
var fs = require('fs');
var coinExchange = require('./coinExchange.js');
var stdGetPublicData = require('./stdGetPublicData.js');
var stdGetPublicData2 = require('./stdGetPublicData2.js');
//var exchangeList = ['coinMarketCap', 'bittrex', 'livecoin', 'cryptopia', 'novaexchange', 'hitBTC', 'yoBit', 'poloniex', 'coinExchange'];
var exchangeList = ['hitBTC', 'yoBit', 'coinExchange'];
var tickerDBColumns = ['exchangeName', 'tradePair', 'askPriceUSD', 'askPriceBTC', 'recordTime', 'trackingStatus'];
var thirtySecThreshold = 0.1,
fiveMinThreshold = 0.0001;
var cmcUSDBTC;

getAllMarketInfo(5000, thirtySecThreshold);

function getAllMarketInfo (timeGap, changeThreshold) {
  for (i=0; i<exchangeList.length; i++) {
    switch (exchangeList[i]) {
      case 'cryptopia':
      case 'hitBTC':
      case 'livecoin':
      case 'poloniex':
      case 'novaexchange':
      case 'coinMarketCap':
        stdGetPublicData.ticker(exchangeList[i], {}, changeThreshold, tickerDBColumns, timeGap);  break;
      case 'yoBit':
      case 'bittrex':
        stdGetPublicData2.getAllMarkets(exchangeList[i], {}, changeThreshold, tickerDBColumns, timeGap); break
      case 'coinExchange':
        coinExchange.coinExchangeMarkets({}, changeThreshold, tickerDBColumns, timeGap); break;
      default:
        break;
    }
  }
 }
