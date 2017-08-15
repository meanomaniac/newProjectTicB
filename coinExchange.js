var fs = require('fs'), createDataObjects = require('./createDataObjects.js'), qualifyData = require('./qualifyData.js');
var rp = require('request-promise');
var coinExchangeMarketMap = {};
var newTickerObj = {};

function coinExchangeTicker(oldTickerObj, changeThreshold, tickerDBColumns, timeGap) {
  console.log('ticker iteration begins for coinExchange');
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
           if ((Object.keys(oldTickerObj)).length == 0) {
             var oldTrackingStatus = 0;
           }
           else {
             var oldTrackingStatus = (oldTickerObj[(Object.keys(oldTickerObj))[0]]).trackingStatus;
           }
           newTickerObj = createDataObjects.createTickerObj('coinExchange', newTickerObj, (coinExchangeMarketMap[returnObj[arrayIndex].MarketID]+'::'+returnObj[arrayIndex].MarketID), returnObj[arrayIndex].AskPrice, timeNow, oldTrackingStatus);
         }
       }
       newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
       qualifyData('coinExchange', oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
       //return newTickerObj;
       oldTickerObj = newTickerObj;
       setTimeout(function() {
         coinExchangeMarkets (oldTickerObj, changeThreshold, tickerDBColumns, timeGap);
       }, timeGap);
    })
    .catch(e => {
      console.log('error in coinexchange ticker');
      console.log(e);
    })
}

function coinExchangeMarkets (oldTickerObj, changeThreshold, tickerDBColumns, timeGap) {
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
     coinExchangeTicker (oldTickerObj, changeThreshold, tickerDBColumns, timeGap);
    })
    .catch(e => {
      console.log('error in coinexchange markets');
      console.log(e);
    })
}

function getOpenOrders (tradePairArr, iterator) {
  iterator++;
  var tradePair = tradePairArr[iterator];
  tradePair = (tradePair.split("::"))[1];
  var options = {
    method: 'GET',
    uri: 'https://www.coinexchange.io/api/v1/getorderbook?market_id='+tradePair,
    headers: { 'User-Agent': 'test' },
    json: true
  }

  rp(options)
    .then(body => {
        var returnObj2 = body;
        var buyLoopVar = returnObj2.result.BuyOrders; var sellLoopVar = returnObj2.result.SellOrders;
        var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
          for (var i in buyLoopVar) {
          var buyObj = Number(returnObj2.result.BuyOrders[i].Quantity)*Number(returnObj2.result.BuyOrders[i].Price);
           buyArray.push(+buyObj);
           totalBuyAmount+=buyObj;
        }
        for (var i in sellLoopVar) {
        var sellObj = Number(returnObj2.result.SellOrders[i].Quantity)*Number(returnObj2.result.SellOrders[i].Price);
         sellArray.push(+sellObj);
         totalSellAmount+=sellObj;
      }
      if (buyArray.length == 0) {
        buyArray.push(0);
      }
      if (sellArray.length == 0) {
        sellArray.push(0);
      }
      var timeNow = new Date();
      createDataObjects.returnopenOrdersObj('coinExchange', tradePair, Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                      buyLoopVar.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                      Math.min.apply(Math, sellArray), sellLoopVar.length, totalSellAmount, timeNow);
      if (iterator<tradePairArr.length-1) {
        setTimeout(function () {getOpenOrders (tradePairArr, iterator);}, 200);
      }
  })
  .catch(e => {
    console.log('error in coinexchange open orders');
    console.log(e);
  })
}


function getOrderHistory (tradePairArr, iterator) {
  iterator++;
  var tradePair = tradePairArr[iterator];
  tradePair = (tradePair.split("::"))[1];
  var options = {
    method: 'GET',
    uri: 'https://www.coinexchange.io/api/v1/getmarketsummary?market_id='+tradePair,
    headers: { 'User-Agent': 'test' },
    json: true
  }

  rp(options)
    .then(body => {
          var returnObj3 = body;
          var timeNow = new Date();
          createDataObjects.returnHistoryObj('coinExchange', tradePair, 0, 0,
                                        returnObj3.result.BuyOrderCount, returnObj3.result.BTCVolume, 0,
                                        0, returnObj3.result.SellOrderCount, 0, timeNow);
        if (iterator<tradePairArr.length-1) {
            setTimeout(function () {getOrderHistory (tradePairArr, iterator);}, 200);
          }
  })
  .catch(e => {
    console.log('error in coinexchange order history');
    console.log(e);
  })
}


module.exports = {coinExchangeMarkets, getOpenOrders, getOrderHistory};
