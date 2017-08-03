var mysql = require('mysql');
var con = mysql.createConnection({
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
      var dbtradePair = objArr[iterator].tradePair || "null", dbaskPriceUSD = objArr[iterator].SPUSD || -1,
      dbaskPriceBTC = objArr[iterator].SPBTC || -1, dbrecordTime = objArr[iterator].time || "null",
      dbtrackingStatus = objArr[iterator].trackingStatus || -1;
      queryParameters.push(exchange, dbtradePair,dbaskPriceUSD,dbaskPriceBTC,dbrecordTime,dbtrackingStatus);
    }
    else if (table == 'openOrders' || table == 'orderHistory') {
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
    // console.log(query);
  con.query(query, queryParameters, function (err, result) {
    if (err) {
      console.log("dbError: "+err);
      console.log('query: ');
      console.log(query1);
    };
    if (iterator < objArr.length -1) {
      writeToDB(table, exchange, columnsArr, objArr, iterator);
    }
  });
}

/*
function writeToDB(table, exchange, columnsArr, objArr) {
  for (var iterator=0; iterator<objArr.length; iterator++) {
      var queryParameters = [];
      if (table = 'cTicker') {
        var dbtradePair = objArr[iterator].tradePair || "null", dbaskPriceUSD = objArr[iterator].SPUSD || -1,
        dbaskPriceBTC = objArr[iterator].SPBTC || -1, dbrecordTime = objArr[iterator].time || "null",
        dbtrackingStatus = objArr[iterator].trackingStatus || -1;
        queryParameters.push(exchange, dbtradePair,dbaskPriceUSD,dbaskPriceBTC,dbrecordTime,dbtrackingStatus);
      }
      else if (table == 'openOrders' || table == 'orderHistory') {
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
      // console.log(query);
      con.query(query, queryParameters, function (err, result) {
        if (err) {
          console.log("dbError: "+err);
        };
      });
  }
}
*/

module.exports = writeToDB;
