
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
//  coinExchange();

  cryptopia.orderHistory('AC/BTC', [24], -1);

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

function qualifyData(exchange, oldTickerObj, newTickerObj, changeThreshold) {
  for (var i=0; i<Object.keys(newTickerObj).length; i++) {
    var arrayIndex = Object.keys(newTickerObj)[i];
    var dbArray = [];
    var marketDataArray = [];
    var priceDiff;
    if (oldTickerObj[arrayIndex] != undefined) {
      priceDiff = Math.abs((newTickerObj[arrayIndex].SP-oldTickerObj[arrayIndex].SP)/oldTickerObj[arrayIndex].SP);
    }
    else {
      priceDiff = 10000;
    }
    if (oldTickerObj[arrayIndex] == undefined ||  priceDiff > changeThreshold) {
      dbArray.push(newTickerObj[arrayIndex]);
      if (changeThreshold >= 0.1) {
        marketDataArray.push(newTickerObj[arrayIndex].symbol);
      }
      // result[0][Object.keys(result[0])[2]]
    }
  }
  if (dbArray.length > 0) {
    writeToDB(exchange, dbArray);
  }
  if (marketDataArray.length > 0) {
    exchange.openOrders(marketDataArray);
    exchange.orderHistory(marketDataArray);
  }
}
function writeToDB(exchange, objArr) {
  for (var i=0; i<objArr.length; i++) {
    // console.log(objArr[i]);
    // handle DB writing cases for different number of parameters in the object
    var query = "INSERT INTO ?? (postId, recordTime, shares, likes, comments) VALUES (?, ?, ?, ?, ?)";
    var queryParameters = [exchange, parsedObj.id, timeNow, parsedObj.shares, parsedObj.likes, parsedObj.comments];
    con.query(query, queryParameters, function (err, result) {
      if (err) throw err;
      // console.log("1 record inserted");
    });
    //sql write record
  }
}

function createTickerObj(exchange, tickerObj, label, spVar, timeVar, oldTrackingStatus) {
  var objProperty = returnObj.Data[i].Label;
  if (returnObj.Data[i].Label.toUpperCase().indexOf('BTC') !== -1) && ((returnObj.Data[i].Label.toUpperCase().indexOf('USD') !== -1) || (returnObj.Data[i].Label.toUpperCase().indexOf('USA') !== -1)) {
      objProperty = 'USD_BTC';
    if (exchange == 'coinMarketCap') {
      cmcUSDBTC = spVar;
    }
  }
  newTickerObj.objProperty = {symbol: label,
                              SP: spVar,
                              time: timeVar,
                              timeSincePreviousEntry: (oldTrackingStatus + 1)
                             }
  return tickerObj;
}

function returnCompleteTickerObj (tickerObj, oldTickerObj) {
  if (tickerObj.USD_BTC == undefined) {
    tickerObj.USD_BTC = {symbol: 'USD_BTC',
                                SP: cmcUSDBTC,
                                time: timeVar,
                                timeSincePreviousEntry: -100
                               };
  }
    for (var i=0; i<Object.keys(newTickerObj).length; i++) {
      var arrayIndex = Object.keys(newTickerObj)[i];
      tickerObj[arrayIndex].SPUSD = tickerObj.USD_BTC.SP * tickerObj[arrayIndex].SP;
    }

  oldTickerObj = tickerObj;
  return tickerObj;
}

function returnopenOrdersObj (exchange, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount) {
  var dbArray = [];
  dbArray.push(openOrdersObj);
  writeToDB('cryptopia', dbArray);
}

function returnHistoryObj (exchange, maxBuy, minBuy, totalBuys, totalBuyAmount, maxSell, minSell, totalSells, totalSellAmount) {
  var dbArray = [];
  dbArray.push(orderHistoryObj);
  writeToDB('cryptopia', dbArray);
}

module.exports = {qualifyData, createTickerObj};
/*
run a setInterval every 5 mins and insert a record into the DB if the new value of a market is more than its value 5 mins ago by
atleast .0001 (1/10000). Run another setInterval every 30 seconds and insert a record into the DB if the new value of a market is more
than its value 30 secs ago by atleast .1 (1/10)s

return an object with all markets from all the ticker functions (exchanges) that the main app.js can use and loop through each market
to calculate the above conditions and add to a database when the criteria is met. Put all this into a function that accepts
a time interval and the changeAcceptance criteria, which you can use to make 2 different calls based on the 2 different conditions that
you've described aboves.
Make a tables for each of the exchanges with typically five columns: symbol, askPriceUSD, askPriceBTC, recordTime, timeSincePreviousEntry
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
