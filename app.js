
var coinMarketCap = require('./tickerFiles/coinMarketCap.js');
var bittrex = require('./tickerFiles/bittrex.js');
var livecoin = require('./tickerFiles/livecoin.js');
var cryptopia = require('./tickerFiles/cryptopia.js');
var novaexchange = require('./tickerFiles/novaexchange.js');
var hitBTC = require('./tickerFiles/hitBTC.js');
var yoBit = require('./tickerFiles/yoBit.js');
var poloniex = require('./tickerFiles/poloniex.js');
var coinExchange = require('./tickerFiles/coinExchange.js');

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

 // coinMarketCap.ticker();
 // bittrex();
 // livecoin();
 // cryptopia();
 // novaexchange ();
 // hitBTC ();
 // yoBit();
 // poloniex ();
 // coinExchange();

/*
run a setInterval every 5 mins and insert a record into the DB if the new value of a market is more than its value 5 mins ago by
atleast .0001 (1/10000). Run another setInterval every 30 seconds and insert a record into the DB if the new value of a market is more
than its value 30 secs ago by atleast .1 (1/10)s
return an object with all markets from all the ticker functions (exchanges) that the main app.js can use and loop through each market
to calculate the above conditions and add to a database when the criteria is met. Put all this into a function that accepts
a time interval and the changeAcceptance criteria, which you can use to make 2 different calls based on the 2 different conditions that
you've described aboves
Make 9 tables - one for each of the exchange with typically four columns symbol, askPrice, recordTime, trackingStatus
CoinMarketCap can have 2 separate columns for askPrice - askPriceUSD, askPriceBTC
coinExchange can have an additional column for marketID that it uses
*/
