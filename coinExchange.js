//CoinExchange - change marketIDs to currencies

var fs = require('fs'), createDataObjects = require('./createDataObjects.js'), qualifyData = require('./qualifyData.js');
var rp = require('request-promise');
var coinExchangeMarketMap = {};
var newTickerObj = {};

function coinExchangeTicker(oldTickerObj, changeThreshold, tickerDBColumns) {
  var options = {
    method: 'GET',
    uri: 'https://www.coinexchange.io/api/v1/getmarketsummaries',
    headers: { 'User-Agent': 'test' },
    json: true
  }

  rp(options)
    .then(body => {
         var timeNow = new Date();
         if (body.result !=null && body.result !=undefined) {
           var returnObj = body.result;
         }
         for (var arrayIndex in returnObj) {
         if (returnObj[arrayIndex] != null) {
           if (oldTickerObj.marketLabel != undefined) {
             var oldTrackingStatus = oldTickerObj.marketLabel.trackingStatus;
           }
           else {
             var oldTrackingStatus = 0;
           }
           newTickerObj = createDataObjects.createTickerObj('coinExchange', newTickerObj, (coinExchangeMarketMap[returnObj[arrayIndex].MarketID]+'::'+returnObj[arrayIndex].MarketID), returnObj[arrayIndex].AskPrice, timeNow, oldTrackingStatus);
         }
       }
       newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
       qualifyData('coinExchange', oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
       return newTickerObj;
    })
    .catch(e => {
      console.log('error in coinexchange ticker');
      console.log(e);
    })
}

function coinExchangeMarkets (oldTickerObj, changeThreshold, tickerDBColumns) {
  var options = {
    method: 'GET',
    uri: 'https://www.coinexchange.io/api/v1/getmarkets',
    headers: { 'User-Agent': 'test' },
    json: true
  }

  rp(options)
    .then(body => {
         var timeNow = new Date();
         if (body.result !=null && body.result !=undefined) {
          var returnObj = body.result;
          }
         for (var arrayIndex in returnObj) {
          if (returnObj[arrayIndex] != null ) {

             if (returnObj[arrayIndex].BaseCurrencyCode == 'BTC') {
         coinExchangeMarketMap[returnObj[arrayIndex].MarketID] = returnObj[arrayIndex].MarketAssetCode+"-"+returnObj[arrayIndex].BaseCurrencyCode;
        }
       }
     }
     coinExchangeTicker (oldTickerObj, changeThreshold, tickerDBColumns);
    })
    .catch(e => {
      console.log('error in coinexchange markets');
      console.log(e);
    })
}

module.exports = coinExchangeMarkets;

/*
current orders:
https://www.coinexchange.io/api/v1/getorderbook?market_id=19

order history - not sure how far the result goes back
https://www.coinexchange.io/api/v1/getmarketsummary?market_id=19
*/
