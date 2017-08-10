var request =require('request'), fs = require('fs'), createDataObjects = require('./createDataObjects.js');
var buyLoopVar, buyCondition, sellCondition, orderType;

function getOrderHistory (exchange, tradePairArr, iterator) {
  // logic to convert the '/' to a '_' for cryptopia only
  iterator++;
  if (exchange == 'cryptopia') {
    if (tradePairArr[iterator].includes('/')) {
      tradePairSplitArr = tradePairArr[iterator].split('/');
      tradePairArr[iterator] = tradePairSplitArr[0]+'_'+tradePairSplitArr[1];
    }
  }
  var dayOldUTCEpoch = parseInt(((new Date()).getTime()-(3600000*24))/1000);
  switch (exchange) {
    case 'cryptopia':
        openOrdersUrl = 'https://www.cryptopia.co.nz/api/GetMarketHistory/'+tradePairArr[iterator]+'/'; break;
    case 'bittrex':
        openOrdersUrl = 'https://bittrex.com/api/v1.1/public/getmarkethistory?market='+tradePairArr[iterator]; break;
    case 'hitBTC':
        openOrdersUrl = 'https://api.hitbtc.com/api/1/public/'+tradePairArr[iterator]+'/trades?from='+dayOldUTCEpoch+'&by=ts'; break;
    case 'livecoin':
        openOrdersUrl = 'https://api.livecoin.net/exchange/last_trades?currencyPair='+tradePairArr[iterator]+'&minutesOrHour=false'; break;
    case 'poloniex':
        openOrdersUrl = 'https://poloniex.com/public?command=returnOrderBook&currencyPair='+tradePairArr[iterator]; break;
    case 'yoBit':
        openOrdersUrl = 'https://yobit.net/api/3/depth/'+tradePairArr[iterator]; break;
    case 'novaexchange':
        openOrdersUrl = 'https://novaexchange.com/remote/v2/market/orderhistory/'+tradePairArr[iterator]+'/'; break;
    default: break;
  }
  request(openOrdersUrl, function (error, response, body) {
    if (!error && response.statusCode == 200 && JSON.parse(body) != null) {
    //  console.log('orderHistory entered');
      var returnObj3 = (JSON.parse(body));
      var buyArray = [], sellArray = [], totalBuyAmount = 0, totalSellAmount = 0;
      switch (exchange) {
        case 'cryptopia':
            buyLoopVar = returnObj3.Data; buyCondition = 'Buy';  sellCondition = 'Sell'; break;
        case 'bittrex':
            buyLoopVar = returnObj3.result; buyCondition = 'BUY';  sellCondition = 'SELL'; break;
        case 'poloniex':
        case 'livecoin':
            buyLoopVar = returnObj3; buyCondition = 'BUY';  sellCondition = 'SELL'; break;
        case 'hitBTC':
            buyLoopVar = returnObj3.trades; buyCondition = true;  sellCondition = false; break;
        case 'novaexchange':
            buyLoopVar = returnObj3.items; buyCondition = 'BUY';  sellCondition = 'SELL'; break;
        case 'yoBit':
            buyLoopVar = (returnObj2[tradePairArr[iterator]]).bids; sellLoopVar = (returnObj2[tradePairArr[iterator]]).asks; break;
        default: break;
      }
        for (var i in buyLoopVar) {
          switch (exchange) {
            case 'cryptopia':
                buyObj = returnObj3.Data[i].Total; orderType = returnObj3.Data[i].Type; break;
            case 'bittrex':
                buyObj = returnObj3.result[i].Total; orderType = returnObj3.result[i].OrderType; break;
            case 'poloniex':
            case 'livecoin':
                buyObj = Number((returnObj3[i])['price'])*Number((returnObj3[i])['quantity']); orderType = (returnObj3[i])['type']; break;
            case 'hitBTC':
                buyObj = Number(returnObj3.trades[i][1])*Number(returnObj3.trades[i][2]); orderType = true; break;
            case 'novaexchange':
                buyObj = Number((returnObj3.items[i])['baseamount'])*Number((returnObj3.items[i])['price']); orderType = (returnObj3.items[i])['tradetype']; break;
            case 'yoBit':
                buyObj = Number((returnObj2[tradePairArr[iterator]].bids[i])[0])*Number((returnObj2[tradePairArr[iterator]].bids[i])[1]); break;
            default: break;
          }
         if (orderType == buyCondition && buyObj != 0) {
           buyArray.push(+buyObj);
           totalBuyAmount+=buyObj;
         }
         else if (orderType == sellCondition && buyObj != 0) {
           sellArray.push(+buyObj);
           totalSellAmount+=buyObj;
         }
      }
      if (buyArray.length == 0) {
        buyArray.push(0);
      }
      if (sellArray.length == 0) {
        sellArray.push(0);
      }
      var timeNow = new Date();
      createDataObjects.returnHistoryObj(exchange, tradePairArr[iterator], Math.max.apply(Math, buyArray), Math.min.apply(Math, buyArray),
                                    buyArray.length, totalBuyAmount, Math.max.apply(Math, sellArray),
                                    Math.min.apply(Math, sellArray), sellArray.length, totalSellAmount, timeNow);
    }
    else {
      console.log('get in orderHistory failed: ');
      console.log(tradePairArr[iterator]);
      console.log(body);
    }
    if (iterator<tradePairArr.length-1) {
      getOrderHistory (exchange, tradePairArr, iterator);
    }
  });
    }

    module.exports = {getOrderHistory};
