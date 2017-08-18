var mysql = require('mysql'),
con = mysql.createConnection({
  host: "pocu3.ceixhvsknluf.us-east-2.rds.amazonaws.com",
  post: "3306",
  user: "SYSTEM",
  password: "mysqlmysql",
  database : 'pocu3'
});

function writeToDB(table, exchange, columnsArr, objArr, iterator) {
    iterator++;
    var queryParameters = [];
    if (table == 'cTicker') {
    //if (table == 'cTickerTest') {
      var dbtradePair = objArr[iterator].tradePair || "null", dbaskPriceUSD = objArr[iterator].SPUSD || -1,
      dbaskPriceBTC = objArr[iterator].SPBTC || -1, dbrecordTime = objArr[iterator].time || "null",
      dbtrackingStatus = objArr[iterator].trackingStatus || -1, dbpriceChange = objArr[iterator].priceChange;
      queryParameters.push(exchange, dbtradePair,dbaskPriceUSD,dbaskPriceBTC,dbrecordTime,dbtrackingStatus,dbpriceChange);
    }
    else if (table == 'openOrders' || table == 'orderHistory') {
    //else if (table == 'openOrdersTest' || table == 'orderHistoryTest') {
      var dbtradePair = objArr[iterator].tradePair || "null", dbmaxBuy = objArr[iterator].maxBuy || -1,
      dbminBuy = objArr[iterator].minBuy || -1, dbtotalBuys = objArr[iterator].totalBuys || -1,
      dbtotalBuyAmount = objArr[iterator].totalBuyAmount || -1, dbmaxSell = objArr[iterator].maxSell || -1,
      dbminSell = objArr[iterator].minSell || -1, dbtotalSells = objArr[iterator].totalSells || -1,
      dbtotalSellAmount = objArr[iterator].totalSellAmount || -1, dbrecordTime = objArr[iterator].recordTime || "null";
      queryParameters.push(exchange, dbtradePair, dbmaxBuy, dbminBuy, dbtotalBuys, dbtotalBuyAmount, dbmaxSell, dbminSell,
                          dbtotalSells, dbtotalSellAmount, dbrecordTime);
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
    //console.log(query);
    con.query(query, queryParameters, function (err, result) {
    if (err) {
      var errTime = new Date();
      console.log("query: "+query);
      console.log("dbError at "+errTime+": "+err);
    };
    if (iterator < objArr.length -1) {
      writeToDB(table, exchange, columnsArr, objArr, iterator);
    }
  });
}

module.exports = writeToDB;
