
var fs = require('fs');
var coinMarketCap = require('./tickerFiles/coinMarketCap.js');
var bittrex = require('./tickerFiles/bittrex.js');
var livecoin = require('./tickerFiles/livecoin.js');
var cryptopia = require('./tickerFiles/cryptopia.js');
var novaexchange = require('./tickerFiles/novaexchange.js');
var hitBTC = require('./tickerFiles/hitBTC.js');
var yoBit = require('./tickerFiles/yoBit.js');
var poloniex = require('./tickerFiles/poloniex.js');
var coinExchange = require('./tickerFiles/coinExchange.js');
var exchanges = [coinMarketCap, bittrex, livecoin, cryptopia, novaexchange, hitBTC, yoBit, poloniex, coinExchange];
var tickerDBColumns = ['exchangeName', 'tradePair', 'askPriceUSD', 'askPriceBTC', 'recordTime', 'trackingStatus'];
var openOrdersDBColumns = ['exchangeName', 'tradePair', 'maxBuy', 'minBuy', 'totalBuys', 'totalBuyAmount', 'maxSell', 'minSell', 'totalSells', 'totalSellAmount', 'recordTime'];
var orderHistoryDBColumns = ['exchangeName', 'tradePair', 'maxBuy', 'minBuy', 'totalBuys', 'totalBuyAmount', 'maxSell', 'minSell', 'totalSells', 'totalSellAmount', 'recordTime'];
var thirtySecThreshold = 0.1,
fiveMinThreshold = 0.0001;
var cmcUSDBTC;
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "pocu3.ceixhvsknluf.us-east-2.rds.amazonaws.com",
  post: "3306",
  user: "SYSTEM",
  password: "mysqlmysql",
  database : 'pocu3'
});



var setIntervalSynchronous = function (func, delay) {
  var intervalFunction, timeoutId, clear;
  // Call to clear the interval.
  clear = function () {
    clearTimeout(timeoutId);
  };
  intervalFunction = function () {
    func();
    timeoutId = setTimeout(intervalFunction, delay);
  }
  // Delay start.
  timeoutId = setTimeout(intervalFunction, delay);
  // You should capture the returned function for clearing.
  return clear;
};

// writeAllQualifiedMarketsToDB (30000, thirtySecThreshold);
// writeAllQualifiedMarketsToDB (300000, fiveMinThreshold);

 // coinMarketCap.ticker();
 // bittrex();
 // livecoin();
 // cryptopia.openOrders('AC_BTC');
 // novaexchange ();
 // hitBTC ();
 // yoBit();
 // poloniex ();
 // coinExchange();
 // cryptopia.orderHistory('AC/BTC', [24], -1);
var sampledbArray = [
  {'var1': '1', 'var2': 2, 'var3':3, 'var4':'4', 'var5': 5},
  {'var6': '6', 'var7': 7, 'var8':8, 'var9':'9', 'var10': 10}
];
// writeToDB('testExchange', sampledbArray, -1);


function returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, functionIteration) {
  functionIteration++;
  // use functionIteration to loop through all exchangeObjs and perform the following
  // cryptopia.ticker(cryptopia, exchangeObjs.cryptopia, changeThreshold);
  newTickerObj = exchange();

  // got to the next exchange by recursively calling the same function itself like below
  if (functionIteration < (exchanges.length -1)) {
    returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, functionIteration);
  }
  else {
    if (marketsWritableToDB.length > 0) {
      // loop through all items of from the above calls and write to DB if array is not empty
    }
  }
}

function writeAllQualifiedMarketsToDB (timeGap, changeThreshold) {
  var coinMarketCapObj, bittrexObj, livecoinObj, cryptopiaObj, novaexchangeObj, hitBTCObj, yoBitObj, poloniexObj, coinExchangeObj;
  var exchangeObjs = [coinMarketCapObj, bittrexObj, livecoinObj, cryptopiaObj, novaexchangeObj, hitBTCObj, yoBitObj, poloniexObj, coinExchangeObj];
  setIntervalSynchronous (function (exchangeObjs, changeThreshold, marketsWritableToDB) {
    var marketsWritableToDB = [];
    returnMarketsWithBigChange (exchangeObjs, changeThreshold, marketsWritableToDB, -1);}, timeGap);
}

var qualifyData = function (exchange, oldTickerObj, newTickerObj, changeThreshold) {
  var dbArray = [];
  for (var i=0; i<Object.keys(newTickerObj).length; i++) {
    var arrayIndex = Object.keys(newTickerObj)[i];
    var marketDataArray = [];
    var priceDiff;
    if (oldTickerObj[arrayIndex] != undefined) {
      priceDiff = Math.abs((newTickerObj[arrayIndex].SPBTC-oldTickerObj[arrayIndex].SPBTC)/oldTickerObj[arrayIndex].SPBTC);
    }
    else {
      priceDiff = 10000;
    }
    if (oldTickerObj[arrayIndex] == undefined ||  priceDiff > changeThreshold) {
      dbArray.push(newTickerObj[arrayIndex]);
      if (changeThreshold >= 0.1) {
        marketDataArray.push(newTickerObj[arrayIndex].tradePair);
      }
      // result[0][Object.keys(result[0])[2]]
    }
  }
  if (dbArray.length > 0) {
    fs.appendFile("/Users/akhilkamma/Desktop/DEV/newProjectTicB/sampleOutput/ticker2/Cryptopia3.txt", " "+JSON.stringify(dbArray), function(err) {
       if(err) { return console.log(err); }
   });
   writeToDB('cTicker', exchange, tickerDBColumns, dbArray, -1);
  }
  if (marketDataArray.length > 0) {
    // exchange.openOrders(marketDataArray, -1);
    // exchange.orderHistory(marketDataArray, -1);
  }
}
function writeToDB(table, exchange, columnsArr, objArr, iterator) {
    iterator++;
    var queryParameters = [];
    if (table = 'cTicker') {
      var dbtradePair = objArr[iterator].tradePair || "null";
      var dbaskPriceUSD = objArr[iterator].SPUSD || -1;
      var dbaskPriceBTC = objArr[iterator].SPBTC || -1;
      var dbrecordTime = objArr[iterator].time || "null";
      var dbtrackingStatus = objArr[iterator].trackingStatus || -1;
      queryParameters.push(exchange, dbtradePair,dbaskPriceUSD,dbaskPriceBTC,dbrecordTime,dbtrackingStatus);
    }
    else if (table == 'openOrders' || table == 'orderHistory') {
      var dbtradePair = objArr[iterator].tradePair || "null";
      var dbmaxBuy = objArr[iterator].maxBuy || -1;
      var dbminBuy = objArr[iterator].minBuy || -1;
      var dbtotalBuys = objArr[iterator].totalBuys || -1;
      var dbtotalBuyAmount = objArr[iterator].totalBuyAmount || -1;
      var dbmaxSell = objArr[iterator].maxSell || -1;
      var dbminSell = objArr[iterator].minSell || -1;
      var dbtotalSells = objArr[iterator].totalSells || -1;
      var dbtotalSellAmount = objArr[iterator].totalSellAmount || -1;
      var dbrecordTime = objArr[iterator].recordTime || "null";
      queryParameters.push(exchange, dbtradePair, dbmaxBuy, dbminBuy, dbtotalBuys, dbtotalBuyAmount, dbmaxSell, dbminSell, dbtotalSells, dbtotalSellAmount, dbrecordTime);
    }
    var query1 = "INSERT INTO "+ table +" (";
    var query2 = ") VALUES (";
    for (var i=0; i<columnsArr.length; i++) {
      query1+= columnsArr[i];
      query2+='?';
      if (i<columnsArr.length-1) {
        query1+=',';
        query2+=',';
      }
    }
    var query =query1+ query2+");";
    // console.log(query);
  con.query(query, queryParameters, function (err, result) {
    if (err) {
      console.log("dbError: "+err);
    };
    if (iterator < objArr.length -1) {
      writeToDB(table, exchange, columnsArr, objArr, iterator);
    }
  });
}

var createTickerObj = function (exchange, tickerObj, label, spVar, timeVar, oldTrackingStatus) {
  var objProperty = label;
  if ((label.toUpperCase().indexOf('BTC') !== -1) && ((label.toUpperCase().indexOf('USD') !== -1) || (label.toUpperCase().indexOf('USA') !== -1))) {
      objProperty = 'USD_BTC';
    if (exchange == 'coinMarketCap') {
      cmcUSDBTC = spVar;
    }
  }
  tickerObj[objProperty] = {tradePair: label,
                              SPBTC: spVar,
                              time: timeVar,
                              trackingStatus: (oldTrackingStatus + 1)
                             }
  return tickerObj;
}

var returnCompleteTickerObj = function (tickerObj, oldTickerObj, timeVar) {
  if (tickerObj.USD_BTC == undefined) {
    tickerObj.USD_BTC = {tradePair: 'USD_BTC',
                                SPBTC: cmcUSDBTC,
                                time: timeVar,
                                trackingStatus: -100
                               };
  }
    for (var i=0; i<Object.keys(tickerObj).length; i++) {
      var arrayIndex = Object.keys(tickerObj)[i];
      tickerObj[arrayIndex].SPUSD = tickerObj.USD_BTC.SPBTC * tickerObj[arrayIndex].SPBTC;
    }

  oldTickerObj = tickerObj;
  console.log(tickerObj[Object.keys(tickerObj)[3]].SPBTC);
  console.log(tickerObj.USD_BTC.SPBTC);
  console.log(tickerObj[Object.keys(tickerObj)[3]].SPUSD);
  return tickerObj;
}

function returnopenOrdersObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, timeNow) {
  var dbArray = [];
  dbArray.push(openOrdersObj);
  writeToDB('cryptopia', dbArray);
}

function returnHistoryObj (exchange, tradePair, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount, timeNow) {
  var dbArray = [];
  dbArray.push(orderHistoryObj);
  writeToDB('cryptopia', dbArray);
}

cryptopia.ticker('cryptopia', {}, 0.1, qualifyData, createTickerObj, returnCompleteTickerObj);

module.exports = {qualifyData, createTickerObj, returnCompleteTickerObj};
/*
run a setInterval every 5 mins and insert a record into the DB if the new value of a market is more than its value 5 mins ago by
atleast .0001 (1/10000). Run another setInterval every 30 seconds and insert a record into the DB if the new value of a market is more
than its value 30 secs ago by atleast .1 (1/10)s

return an object with all markets from all the ticker functions (exchanges) that the main app.js can use and loop through each market
to calculate the above conditions and add to a database when the criteria is met. Put all this into a function that accepts
a time interval and the changeAcceptance criteria, which you can use to make 2 different calls based on the 2 different conditions that
you've described aboves.
Make a tables for each of the exchanges with typically five columns: tradePair, askPriceUSD, askPriceBTC, recordTime, timeSincePreviousEntry
All four columns except askPriceUSD are obtained from the exchange api. askPriceUSD may only be avialble for BTC itself (BTC-USD).
If BTC-USD price isn't available on an exchange then use the one from CoinMarketCap.
askPriceUSD for all other market pairs is calculated from askPriceBTC.
The object returned by the ticker functions contains values for these above mentioned columns as well as the difference in the
askPriceUSD and askPriceBTC from the saved values of the same variables in the last function call. Basically the object contains
datat that the DB funcion can parse and write to DB

CoinMarketCap can have 2 separate columns for askPrice - askPriceUSD, askPriceBTC
coinExchange can have an additional column for marketID that it uses/needs

1 more tables
.1 change over 30 secs:
All groups of columsn below - duplicated for both buy and sell
exchange, orderType(buy/sell), label, totalAmount (typically in BTC), totalOrders, maxPrice (bid/ask), MinPrice (bid/ask),
Market1HrTotalOrders,Market1HrHigh, Market1hrlow, Market1HrTotalVolume
and/or the above listed columns for 24 hours

*/
