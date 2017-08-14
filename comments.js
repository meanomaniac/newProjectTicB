// orderHistory.getOrderHistory('cryptopia', ['DOT_BTC'], -1);
// orderHistory.getOrderHistory('bittrex', ['BTC-LTC'], -1);
// orderHistory.getOrderHistory('hitBTC', ['BCNBTC'], -1);
// orderHistory.getOrderHistory('livecoin', ['BTC/USD'], -1);
// orderHistory.getOrderHistory('poloniex', ['BTC_ETH'], -1);
// orderHistory.getOrderHistory('yoBit', ['eth_btc'], -1);
// coinExchange.getOrderHistory(['87'], -1);
// orderHistory.getOrderHistory('novaexchange', ['BTC_LTC'], -1);

// openOrders.getOpenOrders('cryptopia', ['ZSE_BTC'], -1);
// openOrders.getOpenOrders('bittrex', ['BTC-LTC'], -1);
// openOrders.getOpenOrders('hitBTC', ['BCNBTC'], -1);
// openOrders.getOpenOrders('livecoin', ['BTC/USD'], -1);
// openOrders.getOpenOrders('poloniex', ['BTC_NXT'], -1);
// openOrders.getOpenOrders('yoBit', ['eth_btc'], -1);
// coinExchange.getOpenOrders(['87'], -1);
// openOrders.getOpenOrders('novaexchange', ['BTC_LTC'], -1);

// cryptopia.ticker('cryptopia', {}, 0.1, tickerDBColumns);
// cryptopia.openOrders(['ZSE_BTC'], -1);
// cryptopia.orderHistory(['4CHN_BTC'], -1);
// stdGetPublicData.ticker('coinMarketCap', {}, 0.1, tickerDBColumns);
// stdGetPublicData2.getAllMarkets('yoBit', {}, 0.1, tickerDBColumns);
// coinExchange({}, 0.1, tickerDBColumns);





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
