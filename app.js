/*
The setIntervalSynchronous function allows the execution of setInterval in a synchronous way (https://gist.github.com/AndersDJohnson/4385908)
*/
var fs = require('fs'), coinExchange = require('./coinExchange.js'), stdGetPublicData = require('./stdGetPublicData.js'),
stdGetPublicData2 = require('./stdGetPublicData2.js'),
//getBittrexPublicData = require('./getBittrexPublicData.js'),
exchangeList = ['coinMarketCap', 'bittrex', 'livecoin', 'cryptopia', 'novaexchange', 'hitBTC', 'yoBit', 'poloniex', 'coinExchange'],
//exchangeList = ['novaexchange'],
tickerDBColumns = ['exchangeName', 'tradePair', 'askPriceUSD', 'askPriceBTC', 'recordTime', 'trackingStatus', 'priceChange'],
thirtySecThreshold = 0.0001, cmcUSDBTC;

getAllMarketInfo(30000, thirtySecThreshold);

function getAllMarketInfo (timeGap, changeThreshold) {
  for (var i=0; i<exchangeList.length; i++) {
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
