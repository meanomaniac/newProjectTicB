var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js');

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

    module.exports = {orderHistory};
