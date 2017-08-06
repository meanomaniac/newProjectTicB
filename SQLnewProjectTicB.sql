use pocu3;

CREATE TABLE cTicker (
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(10) NULL,
	askPriceUSD FLOAT NULL,
	askPriceBTC FLOAT NULL,
	recordTime DATETIME NULL,
	trackingStatus MEDIUMINT NULL
);

CREATE TABLE openOrders (	 
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(10) NULL,
	maxBuy FLOAT NULL,
	minBuy FLOAT NULL,
    totalBuys MEDIUMINT NULL,
    totalBuyAmount FLOAT NULL,
    maxSell FLOAT NULL, 
    minSell FLOAT NULL, 
    totalSells MEDIUMINT NULL,
    totalSellAmount FLOAT NULL,
	recordTime DATETIME NULL
);

CREATE TABLE orderHistory (	 
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(10) NULL,
	maxBuy FLOAT NULL,
	minBuy FLOAT NULL,
    totalBuys MEDIUMINT NULL,
    totalBuyAmount FLOAT NULL,
    maxSell FLOAT NULL, 
    minSell FLOAT NULL, 
    totalSells MEDIUMINT NULL,
    totalSellAmount FLOAT NULL,
	recordTime DATETIME NULL
);

describe cTicker;
drop table cTicker;

delete from cTicker where true=true;
delete from openOrders where true=true;
delete from orderHistory where true=true;
show tables;
describe openOrders;


select * from cTicker;
select * from openOrders;
select * from orderHistory;
select count(*) from cTicker;
select count(*) from openOrders;
select count(*) from orderHistory;

