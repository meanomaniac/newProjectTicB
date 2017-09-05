var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js'),
qualifyData = require('./qualifyData.js');

function getMarketPrices (counter, exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap, markets, newTickerObj) {
  var tickerUrl;
  var arrayIndex = counter + 1;
  var label = markets[arrayIndex];
  switch (exchange) {
    case 'bittrex':
      tickerUrl = 'https://bittrex.com/api/v1.1/public/getticker?market=';
      break;
    case 'yoBit':
      tickerUrl = 'https://yobit.net/api/3/ticker/';
      break;
    default:
      break;
  }
  var timeNow = new Date();
    request(tickerUrl+markets[arrayIndex], function (error, response, body) {
      var responseIsValid = true;
      try {
        JSON.parse(body);
      } catch (e) {
        responseIsValid = false;
        //console.log ('invalid ticker response received from '+exchange);
      }

      if (responseIsValid) {
        if (!error && response.statusCode == 200 && JSON.parse(body)) {
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
              if (data[Object.keys(data)[0]]) {
                tickerConditionalObj1 = data[Object.keys(data)[0]]; tickerConditionalObj2 = data[Object.keys(data)[0]];
                btcPriceObj = data[Object.keys(data)[0]].buy; break;
              }
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
            qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
            oldTickerObj[label] = newTickerObj[label];
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
          //if (error && !((JSON.stringify(error)).includes("code: 'ECONNRESET'")))
          newTickerObj[label] = {};
          if (error && exchange != 'yoBit') {
            var errTime = new Date();
            console.log('ticker for exchange '+exchange+' failed at '+errTime);
            //console.log(error);
          }
      //
      }
    }
    else {
      //if (error && !((JSON.stringify(error)).includes("code: 'ECONNRESET'")))
      newTickerObj[label] = {};
      if (error && exchange != 'yoBit') {
        var errTime = new Date();
        console.log('ticker for exchange '+exchange+' failed at '+errTime);
        //console.log(error);
      }
  //
  }
  // moved the recursive call for yoBit and Bittrex (to continue the ticker) outside as for some reason its not getting called on
  // some occasions (with no error).
}, true);

  if (arrayIndex<markets.length-1) {
    getMarketPrices (arrayIndex, exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap, markets, newTickerObj);
  }
  else {
    // switch (exchange) {
    //   case 'bittrex':
    //     timeGap = timeGap + 5000; break;
    //   case 'yoBit':
    //       timeGap = timeGap + 10000; break;
    //   default: break;
    //
    // }
      setTimeout(function() {
        // newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
        // qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
        // oldTickerObj = newTickerObj;
        getAllMarkets (exchange, oldTickerObj, changeThreshold, tickerDBColumns, timeGap);
      }, timeGap);
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
