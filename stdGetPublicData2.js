var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js'),
qualifyData = require('./qualifyData.js');

function getMarketPrices (counter, exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap, markets, newTickerObj) {
  var tickerUrl;
  var arrayIndex = counter + 1;
  var label = markets[arrayIndex];
  switch (exchange) {
    case 'bittrex':
      tickerUrl = 'https://bittrex.com/api/v1.1/public/getticker?market='; break;
    case 'yoBit':
      tickerUrl = 'https://yobit.net/api/3/ticker/'; break;
    default:
      break;
  }
  var timeNow = new Date();
    request(tickerUrl+markets[arrayIndex], function (error, response, body) {
      if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
        var data= JSON.parse(body), tickerConditionalObj1, tickerConditionalObj2, btcPriceObj = null;
        switch (exchange) {
          case 'bittrex':
            if (data.result) {
              tickerConditionalObj1 = data; tickerConditionalObj2 = data.result;
              btcPriceObj = data.result.Ask; break;
            }
            else {
              console.log('bittrex getticker failed at '+timeNow); break;
            }
          case 'yoBit':
            tickerConditionalObj1 = data[Object.keys(data)[0]]; tickerConditionalObj2 = data[Object.keys(data)[0]];
            btcPriceObj = data[Object.keys(data)[0]].buy; break;
          default:
            break;
        }
        if (btcPriceObj) {
        if (tickerConditionalObj1 && tickerConditionalObj2) {
        //  if ((Object.keys(oldTickerObj)).length == 0)
          if (((Object.keys(oldTickerObj)).length == 0) || ((oldTickerObj[(Object.keys(oldTickerObj))[0]]).trackingStatus == -1)){
            var oldTrackingStatus = 0;
          }
          else {
            var oldTrackingStatus = (oldTickerObj[(Object.keys(oldTickerObj))[0]]).trackingStatus;
          }
          newTickerObj = createDataObjects.createTickerObj(exchange, newTickerObj, markets[arrayIndex], btcPriceObj, timeNow, oldTrackingStatus);
        }
        else {
          console.log(markets[arrayIndex] + " at index: " + arrayIndex+" not found");
          newTickerObj[label] = {};
        }
      }
      else {
        newTickerObj[label] = {};
      }
    }
    else {
      //if (error && !((JSON.stringify(error)).includes("code: 'ECONNRESET'"))) {
      newTickerObj[label] = {};
      if (error && exchange != 'yoBit') {
        var errTime = new Date();
        console.log('ticker for exchange '+exchange+' failed at '+errTime);
        //console.log(error);
      }
  //  }
  }

  if ((Object.keys(newTickerObj).length)>=(markets.length)) {
    //console.log('all markets covered for '+exchange+' for a total of '+markets.length+' markets');
    newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
    qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
    oldTickerObj = newTickerObj;
    if (exchange != 'yoBit') {
      setTimeout(function() {
        getAllMarkets (exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap);
      }, timeGap);
    }
    //return newTickerObj;
  }
}, true);

  if (arrayIndex<markets.length-1) {
    getMarketPrices (arrayIndex, exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap, markets, newTickerObj);
  }
  else {
    if (exchange == 'yoBit') {
      setTimeout(function() {
        getAllMarkets (exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap);
      }, (timeGap+15000));
    }
  }
}

function getAllMarkets (exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap) {
  var markets = [], newTickerObj = {}, marketUrl;
  switch (exchange) {
    case 'bittrex':
      marketUrl = 'https://bittrex.com/api/v1.1/public/getmarkets'; break;
    case 'yoBit':
      marketUrl = 'https://yobit.net/api/3/info'; break;
    default:
      break;
  }
  var newMarkets = [];
  request(marketUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var count = 0, marketLoopArr, btcStr, btcUsdStr, marketObj;
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
    else {
        var errTime = new Date();
        console.log('getMarketList for exchange '+exchange+' failed at '+errTime);
        //console.log(error);
    }
    markets = newMarkets;
    getMarketPrices (-1, exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap, markets, newTickerObj);
  }, true);
}


module.exports = {getAllMarkets};
