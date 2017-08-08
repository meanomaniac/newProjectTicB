var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js');

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

module.exports = {openOrders};
