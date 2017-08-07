var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js'),
qualifyData = require('./qualifyData.js');

function ticker (exchange, oldTickerObj, changeThreshold, tickerDBColumns) {
  var newTickerObj = {};
    switch (exchange) {
      case 'cryptopia':
        tickerUrl = 'https://www.cryptopia.co.nz/api/GetMarkets'; break;
      case 'hitBTC':
        tickerUrl = 'https://api.hitbtc.com/api/1/public/ticker'; break;
      case 'livecoin':
        tickerUrl = 'https://api.livecoin.net/exchange/ticker'; break;
      case 'novaexchange':
        tickerUrl = 'https://novaexchange.com/remote/v2/markets/'; break;
      case 'poloniex':
        tickerUrl = 'https://poloniex.com/public?command=returnTicker'; break;
      default:
        break;
    }
  request(tickerUrl, function (error, response, body) {
    if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
        var returnObj = JSON.parse(body);
        switch (exchange) {
          case 'cryptopia':
            tickerLoopArr = returnObj.Data; btcStr = '/BTC'; btcUsdStr = 'BTC/USDT'; break;
          case 'hitBTC':
            tickerLoopArr = returnObj; btcStr = 'BTC'; btcUsdStr = 'BTCUSD'; break;
          case 'livecoin':
            tickerLoopArr = returnObj; btcStr = '/BTC'; btcUsdStr = 'BTC/USD'; break;
          case 'novaexchange':
            tickerLoopArr = returnObj.markets; btcStr = 'BTC_'; btcUsdStr = 'BTC_'; break;
          case 'poloniex':
            tickerLoopArr = returnObj; btcStr = 'BTC_'; btcUsdStr = 'USDT_BTC'; break;
          default:
            break;
        }
        var timeNow = new Date();
        for (var i in tickerLoopArr) {
            switch (exchange) {
              case 'cryptopia':
                labelObj = returnObj.Data[i].Label; btcPriceObj = returnObj.Data[i].AskPrice; break;
              case 'hitBTC':
                labelObj = i; btcPriceObj = returnObj[i].bid; break;
              case 'livecoin':
                labelObj = returnObj[i].symbol; btcPriceObj = returnObj[i].best_ask; break;
              case 'novaexchange':
                labelObj = returnObj.markets[i].marketname; btcPriceObj = returnObj.markets[i].ask; break;
              case 'poloniex':
                labelObj = i; btcPriceObj = returnObj[i].lowestAsk; break;
              default:
                break;
            }

            if (tickerLoopArr[i] != null && (labelObj.indexOf(btcStr) !== -1 || labelObj.indexOf(btcUsdStr) !== -1 )) {
            var marketLabel = labelObj;
            if (oldTickerObj.marketLabel != undefined) {
              oldTrackingStatus = oldTickerObj.marketLabel.trackingStatus;
            }
            else {
              oldTrackingStatus = 0;
            }
            newTickerObj = createDataObjects.createTickerObj(exchange, newTickerObj, labelObj, btcPriceObj, timeNow, oldTrackingStatus);
            // save all the markets into an object which will contain properties with the same name as the exchange tradePairs and values being another object with each of the values saved using the file command above
          }
      }
      newTickerObj = createDataObjects.returnCompleteTickerObj(newTickerObj, oldTickerObj, timeNow);
      /*
      fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/ticker2/Cryptopia2.txt", " "+JSON.stringify(newTickerObj), function(err) {
         if(err) { return console.log(err); }
     });
     */
      qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold, tickerDBColumns);
      return newTickerObj;
    }
    else {
      console.log(body);
    }
  });
}

function openOrders (tradePairArr, iterator) {
    iterator++;
    if (tradePairArr[iterator].includes('/')) {
      tradePairSplitArr = tradePairArr[iterator].split('/');
      tradePairArr[iterator] = tradePairSplitArr[0]+'_'+tradePairSplitArr[1];
    }
    request('https://www.cryptopia.co.nz/api/GetMarketOrders/'+tradePairArr[iterator]+'/10000', function (error, response, body) {
      if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
      //  console.log('openOrders entered');
        var returnObj2 = (JSON.parse(body)).Data;
        var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
          for (var i in returnObj2.Buy) {
            /*
            fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/openOrders/CryptopiaOpenOrders.txt", "Buy "+i+": "+returnObj2.Buy[i].Total+"\n", function(err) {
               if(err) { return console.log(err); }
           });
           */
           buyArray.push(+returnObj2.Buy[i].Total);
           totalBuyAmount+=returnObj2.Buy[i].Total;
        }
        // save all the console.logs below as the values of a property in an object, the property having the same name as the tradePair
        // console.log('tradePair: '+tradePairArr[iterator]);  console.log("Buy Max: "+Math.max.apply(Math, buyArray)); console.log("Buy Min: "+Math.min.apply(Math, buyArray)); console.log("Buy Order count: "+returnObj2.Buy.length); console.log("Total Buy amount: "+totalBuyAmount);
        for (var i in returnObj2.Sell) {
          /*
          fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/openOrders/CryptopiaOpenOrders.txt", "Sell "+i+": "+returnObj2.Sell[i].Total+"\n", function(err) {
             if(err) { return console.log(err); }
         });
         */
         sellArray.push(+returnObj2.Sell[i].Total);
         totalSellAmount+=returnObj2.Sell[i].Total;
      }
      if (buyArray.length == 0) {
        buyArray.push(0);
      }
      if (sellArray.length == 0) {
        sellArray.push(0);
      }
      // console.log("Sell Max: "+Math.max.apply(Math, sellArray)); console.log("Sell Min: "+Math.min.apply(Math, sellArray)); console.log("Sell Order count: "+returnObj2.Sell.length); console.log("Total Sell amount: "+totalSellAmount);
      var timeNow = new Date();
      createDataObjects.returnopenOrdersObj('cryptopia', tradePairArr[iterator], Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                      returnObj2.Buy.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                      Math.min.apply(Math, sellArray), returnObj2.Sell.length, totalSellAmount, timeNow);
      }
      else {
        console.log('get in openOrders failed: ');
        console.log(tradePairArr[iterator]);
        console.log(body);
      }
      if (iterator<tradePairArr.length-1) {
        openOrders (tradePairArr, iterator);
      }
    });
}

function orderHistory (tradePairArr, iterator) {
  // logic to convert the '/' to a '_' for cryptopia only
  iterator++;
  if (tradePairArr[iterator].includes('/')) {
    tradePairSplitArr = tradePairArr[iterator].split('/');
    tradePairArr[iterator] = tradePairSplitArr[0]+'_'+tradePairSplitArr[1];
  }
      request('https://www.cryptopia.co.nz/api/GetMarketHistory/'+tradePairArr[iterator], function (error, response, body) {
        if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
        //  console.log('orderHistory entered');
          var returnObj3 = (JSON.parse(body)).Data;
          var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
            for (var i in returnObj3) {
              /*
              fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/orderHistory/CryptopiaorderHistory.txt", returnObj3[i].Type+i+": "+returnObj3[i].Total+"\n", function(err) {
                 if(err) { return console.log(err); }
             });
             */
             if (returnObj3[i].Type == 'Buy') {
               buyArray.push(+returnObj3[i].Total);
               totalBuyAmount+=returnObj3[i].Total;
             }
             else if (returnObj3[i].Type == 'Sell') {
               sellArray.push(+returnObj3[i].Total);
               totalSellAmount+=returnObj3[i].Total;
             }
          }
          if (buyArray.length == 0) {
            buyArray.push(0);
          }
          if (sellArray.length == 0) {
            sellArray.push(0);
          }
          // console.log('tradePair: '+tradePairArr[iterator]); console.log("Buy Max : "+Math.max.apply(Math, buyArray)); console.log("Buy Min : "+Math.min.apply(Math, buyArray)); console.log("Buy Order count : "+buyArray.length); console.log("Total Buy amount : "+totalBuyAmount);
          // console.log("Sell Max : "+Math.max.apply(Math, sellArray)); console.log("Sell Min : "+Math.min.apply(Math, sellArray));  console.log("Sell Order count : "+sellArray.length); console.log("Total Sell amount : "+totalSellAmount);
          var timeNow = new Date();
          createDataObjects.returnHistoryObj('cryptopia', tradePairArr[iterator], Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                        buyArray.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                        Math.min.apply(Math, sellArray), sellArray.length, totalSellAmount, timeNow);
        }
        else {
          console.log('get in orderHistory failed: ');
          console.log(tradePairArr[iterator]);
          console.log(body);
        }
        if (iterator<tradePairArr.length-1) {
          orderHistory (tradePairArr, iterator);
        }
      });
    }

module.exports = {ticker, openOrders, orderHistory};

/*
// orders
https://www.cryptopia.co.nz/api/GetMarketOrders/DOT_BTC
https://www.cryptopia.co.nz/api/GetMarketOrders/DOT_BTC/50


history - default 24 hours
https://www.cryptopia.co.nz/api/GetMarketHistory/DOT_BTC/
https://www.cryptopia.co.nz/api/GetMarketHistory/DOT_BTC/48
*/
