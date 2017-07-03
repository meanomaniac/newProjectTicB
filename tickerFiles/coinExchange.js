//CoinExchange - change marketIDs to currencies

var fs = require('fs');
var rp = require('request-promise');
var coinExchangeMarketMap = {};

function coinExchangeTicker() {
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
         for (var i=0; i<Object.keys(returnObj).length; i++) {
         if (returnObj[Object.keys(returnObj)[i]] != null) {
        fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/CoinExchange.txt", "MarketID: "+returnObj[Object.keys(returnObj)[i]].MarketID+", symbol: "+coinExchangeMarketMap[returnObj[Object.keys(returnObj)[i]].MarketID]+", SP: "+returnObj[Object.keys(returnObj)[i]].AskPrice+", time: "+timeNow+", trackingStatus: \n", function(err) {
           if(err) { return console.log(err); }
       });
     }
     }
    })
    .catch(e => {
      // handle error
    })
}

function coinExchangeMarkets () {
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
         for (var i=0; i<Object.keys(returnObj).length; i++) {
          if (returnObj[Object.keys(returnObj)[i]] != null ) {

             if (returnObj[Object.keys(returnObj)[i]].BaseCurrencyCode == 'BTC') {
         coinExchangeMarketMap[returnObj[Object.keys(returnObj)[i]].MarketID] = returnObj[Object.keys(returnObj)[i]].MarketAssetCode+"-"+returnObj[Object.keys(returnObj)[i]].BaseCurrencyCode;
        }
       }
     }
     coinExchangeTicker ();
    })
    .catch(e => {
      // handle error
    })
}

module.exports = coinExchangeMarkets;
