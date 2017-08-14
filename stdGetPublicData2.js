var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js'),
qualifyData = require('./qualifyData.js');
var markets = [];
var newTickerObj = {};
var getTickerCount = -1;

function getMarketPrices (counter, exchange, oldTickerObj, changeThreshold, tickerDBColumns) {
  switch (exchange) {
    case 'bittrex':
      tickerUrl = 'https://bittrex.com/api/v1.1/public/getticker?market='; break;
    case 'yoBit':
      tickerUrl = 'https://yobit.net/api/3/ticker/'; break;
    default:
      break;
  }
  var arrayIndex = counter + 1;
  var timeNow = new Date();
    request(tickerUrl+markets[arrayIndex], function (error, response, body) {
      if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
        data= JSON.parse(body);
        switch (exchange) {
          case 'bittrex':
            tickerConditionalObj1 = data; tickerConditionalObj2 = data.result;
            btcPriceObj = data.result.Ask; break;
          case 'yoBit':
            tickerConditionalObj1 = data[Object.keys(data)[0]]!=null; tickerConditionalObj2 = data[Object.keys(data)[0]]!=null;
            btcPriceObj = data[Object.keys(data)[0]].buy; break;
          default:
            break;
        }
      if (tickerConditionalObj1 != null && tickerConditionalObj2 != null) {
        if (oldTickerObj.marketLabel != undefined) {
          var oldTrackingStatus = oldTickerObj.marketLabel.trackingStatus;
        }
        else {
          var oldTrackingStatus = 0;
        }
        newTickerObj = createDataObjects.createTickerObj(exchange, newTickerObj, markets[arrayIndex], btcPriceObj, timeNow, oldTrackingStatus);
      }
      else {
        console.log(markets[arrayIndex] + " at index: " + arrayIndex+" not found");
      }
      //console.log(markets[arrayIndex]);
    }
    getTickerCount++;
    if (getTickerCount>=markets.length-1) {
      newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
      qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
      getTickerCount = -1;
      return newTickerObj;
    }
  }, true);

  if (arrayIndex<markets.length-1) {
    getMarketPrices (arrayIndex, exchange, oldTickerObj, changeThreshold, tickerDBColumns);
  }
}

function getAllMarkets (exchange, oldTickerObj, changeThreshold, tickerDBColumns) {
  switch (exchange) {
    case 'bittrex':
      marketUrl = 'https://bittrex.com/api/v1.1/public/getmarkets'; break;
    case 'yoBit':
      marketUrl = 'https://yobit.net/api/3/info'; break;
    default:
      break;
  }
  newMarkets = [];
  request(marketUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var count = 0;
      var data= JSON.parse(body);
      switch (exchange) {
        case 'bittrex':
          marketLoopArr = data.result; btcStr = 'BTC-'; btcUsdStr = 'USDT-BTC'; break;
        case 'yoBit':
          marketLoopArr = data.pairs; btcStr = '_btc'; btcUsdStr = 'btc_usd'; break;
        default:
          break;
      }
      for (var i in marketLoopArr) {
        // Also add logic to delete the corresponding db table and copy these new markets instead
        switch (exchange) {
          case 'bittrex':
            marketObj = data.result[i].MarketName; break;
          case 'yoBit':
            marketObj = i; break;
          default:
            break;
        }
        if (marketObj.indexOf(btcStr) !== -1 || marketObj == btcUsdStr ) {
          newMarkets.push(marketObj);
          count++;
        }
      }
    }
    markets = newMarkets;
    // console.log("total markets count: "+count);
    // console.log("markets array: "+markets);
    getMarketPrices (-1, exchange, oldTickerObj, changeThreshold, tickerDBColumns);
  }, true);
}


module.exports = {getAllMarkets};

/*
// orders
https://www.cryptopia.co.nz/api/GetMarketOrders/DOT_BTC
https://www.cryptopia.co.nz/api/GetMarketOrders/DOT_BTC/50


history - default 24 hours
https://www.cryptopia.co.nz/api/GetMarketHistory/DOT_BTC/
https://www.cryptopia.co.nz/api/GetMarketHistory/DOT_BTC/48
*/
