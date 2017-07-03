// yoBit - https://www.yobit.net/en/api/
var request =require('request');
var fs = require('fs');
var yoBitMarkets = [];

function getYoBitMarketPrices (counter) {
  var arrayIndex = counter + 1;
  var timeNow = new Date();
    request('https://yobit.net/api/3/ticker/'+yoBitMarkets[arrayIndex], function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        if (data[Object.keys(data)[0]]!=null || data[Object.keys(data)[0]] != undefined) {

          fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/yoBitSampleTicker.txt", yoBitMarkets[arrayIndex]+": "+data[Object.keys(data)[0]].buy+", "+timeNow+"\n", function(err) {
              if(err) { return console.log(err); }
          });

        }
        else {
           console.log(yoBitMarkets[arrayIndex] + " at index: " + arrayIndex+" not found");
        }
      }
  }, true);

  if (arrayIndex<yoBitMarkets.length-1) {
    getYoBitMarketPrices (arrayIndex);
  }
  else {
    // console.log('ticker complete');
    return;
  }
}

function getYoBitMarkets () {
  request('https://yobit.net/api/3/info', function (error, response, body) {
    if (!error && response.statusCode == 200) {
         returnObj = JSON.parse(body);
        var timeNow = new Date();
        for (var i=0; i<Object.keys(returnObj.pairs).length; i++) {
          if (Object.keys(returnObj.pairs)[i].indexOf("_btc") !== -1 || Object.keys(returnObj.pairs)[i].indexOf("btc_usd") !== -1) {
            fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/yoBit.txt", Object.keys(returnObj.pairs)[i]+"\n", function(err) {
               if(err) { return console.log(err); }
           });
           yoBitMarkets.push(Object.keys(returnObj.pairs)[i]);
         }
      }
    }
    // console.log(JSON.stringify(yoBitMarkets));
    getYoBitMarketPrices (-1);
  });
}

module.exports = getYoBitMarkets;
