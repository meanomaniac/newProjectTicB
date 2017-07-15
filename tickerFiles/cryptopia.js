//Cryptopia

var request =require('request');
var fs = require('fs');
var mainFunction = require('../app.js');

function ticker (exchange, oldTickerObj, changeThreshold) {
  var newTickerObj = {};
  request('https://www.cryptopia.co.nz/api/GetMarkets', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var returnObj = JSON.parse(body);
        var timeNow = new Date();
        for (var i in returnObj.Data) {
            if (returnObj.Data[i] != null && (returnObj.Data[i].Label.indexOf('/BTC') !== -1 || returnObj.Data[i].Label.indexOf('BTC/USDT') !== -1 )) {
             fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/Cryptopia.txt", "symbol: "+returnObj.Data[i].Label+", SP: "+returnObj.Data[i].AskPrice+", time: "+timeNow+", trackingStatus: \n", function(err) {
                if(err) { return console.log(err); }
            });
            var marketLabel = returnObj.Data[i].Label;
            if (oldTickerObj.marketLabel != undefined) {
              oldTrackingStatus = oldTickerObj.marketLabel.trackingStatus;
            }
            else {
              oldTrackingStatus = 0;
            }
            newTickerObj = mainFunction.createTickerObj(exchange, newTickerObj, returnObj.Data[i].Label, returnObj.Data[i].AskPrice, timeNow, oldTrackingStatus);
            // save all the markets into an object which will contain properties with the same name as the exchange symbols and values being another object with each of the values saved using the file command above
          }
      }
      newTickerObj = mainFunction.returnCompleteTickerObj(newTickerObj, oldTickerObj);
      mainFunction.qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold);
    }
  });
}

function openOrders (tradePair) {
  request('https://www.cryptopia.co.nz/api/GetMarketOrders/'+tradePair+'/10000', function (error, response, body) {
    var returnObj2 = (JSON.parse(body)).Data;
    var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
    if (!error && response.statusCode == 200) {
        for (var i in returnObj2.Buy) {
          fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/openOrders/CryptopiaOpenOrders.txt", "Buy "+i+": "+returnObj2.Buy[i].Total+"\n", function(err) {
             if(err) { return console.log(err); }
         });
         buyArray.push(+returnObj2.Buy[i].Total);
         totalBuyAmount+=returnObj2.Buy[i].Total;
      }
      // save all the console.logs below as the values of a property in an object, the property having the same name as the symbol
      console.log("Buy Max: "+Math.max.apply(Math, buyArray));
      console.log("Buy Min: "+Math.min.apply(Math, buyArray));
      console.log("Buy Order count: "+returnObj2.Buy.length);
      console.log("Total Buy amount: "+totalBuyAmount);
      for (var i in returnObj2.Sell) {
        fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/openOrders/CryptopiaOpenOrders.txt", "Sell "+i+": "+returnObj2.Sell[i].Total+"\n", function(err) {
           if(err) { return console.log(err); }
       });
       sellArray.push(+returnObj2.Sell[i].Total);
       totalSellAmount+=returnObj2.Sell[i].Total;
    }
    console.log("Sell Max: "+Math.max.apply(Math, sellArray));
    console.log("Sell Min: "+Math.min.apply(Math, sellArray));
    console.log("Sell Order count: "+returnObj2.Sell.length);
    console.log("Total Sell amount: "+totalSellAmount);
    mainFunction.returnopenOrdersObj('cryptopia', Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                    returnObj2.Buy.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                    Math.min.apply(Math, sellArray), returnObj2.Sell.length, totalSellAmount);
    }
  });
}

function orderHistory (tradePair, historyTimePeriod, timePeriodCounter) {
  // add logic to convert the '/' to a '_' for cryptopia only
  if (timePeriodCounter<0 && tradePair.includes('/')) {
    tradePairArr = tradePair.split('/');
    tradePair = tradePairArr[0]+'_'+tradePairArr[1];
  }
    timePeriodCounter++;
      request('https://www.cryptopia.co.nz/api/GetMarketHistory/'+tradePair+'/'+historyTimePeriod[timePeriodCounter], function (error, response, body) {
        var returnObj3 = (JSON.parse(body)).Data;
        var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
        if (!error && response.statusCode == 200) {
            for (var i in returnObj3) {
              fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/orderHistory/CryptopiaorderHistory.txt", returnObj3[i].Type+i+": "+returnObj3[i].Total+"\n", function(err) {
                 if(err) { return console.log(err); }
             });
             if (returnObj3[i].Type == 'Buy') {
               buyArray.push(+returnObj3[i].Total);
               totalBuyAmount+=returnObj3[i].Total;
             }
             else if (returnObj3[i].Type == 'Sell') {
               sellArray.push(+returnObj3[i].Total);
               totalSellAmount+=returnObj3[i].Total;
             }
          }
          console.log("Buy Max "+historyTimePeriod[timePeriodCounter]+": "+Math.max.apply(Math, buyArray));
          console.log("Buy Min "+historyTimePeriod[timePeriodCounter]+": "+Math.min.apply(Math, buyArray));
          console.log("Buy Order count "+historyTimePeriod[timePeriodCounter]+": "+buyArray.length);
          console.log("Total Buy amount "+historyTimePeriod[timePeriodCounter]+": "+totalBuyAmount);
          console.log("Sell Max "+historyTimePeriod[timePeriodCounter]+": "+Math.max.apply(Math, sellArray));
          console.log("Sell Min "+historyTimePeriod[timePeriodCounter]+": "+Math.min.apply(Math, sellArray));
          console.log("Sell Order count "+historyTimePeriod[timePeriodCounter]+": "+sellArray.length);
          console.log("Total Sell amount "+historyTimePeriod[timePeriodCounter]+": "+totalSellAmount);
          mainFunction.returnHistoryObj('cryptopia', Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                        buyArray.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                        Math.min.apply(Math, sellArray), sellArray.length, totalSellAmount);
        }
        if (timePeriodCounter < historyTimePeriod.length-1) {
          orderHistory (tradePair, historyTimePeriod, timePeriodCounter);
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
