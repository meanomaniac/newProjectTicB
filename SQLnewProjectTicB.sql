use pocu3;

select * from cTickerTest;
select * from orderHistoryTest where exchangeName = 'poloniex'; 
select * from openOrdersTest;

delete from cTickerTest where true=true;
delete from openOrdersTest where true=true;
delete from orderHistoryTest where true=true;

select * from cTickerTest;
select * from orderHistoryTest; 
select * from openOrdersTest;
select distinct(exchangeName) from cTickerTest;

CREATE TABLE cTicker (
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(20) NULL,
	askPriceUSD FLOAT NULL,
	askPriceBTC FLOAT NULL,
	recordTime DATETIME NULL,
	trackingStatus MEDIUMINT NULL,
    priceChange FLOAT NULL
);

CREATE TABLE openOrders (	 
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(20) NULL,
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
	tradePair VARCHAR(20) NULL,
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

CREATE TABLE cTickerTest (
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(20) NULL,
	askPriceUSD FLOAT NULL,
	askPriceBTC FLOAT NULL,
	recordTime DATETIME NULL,
	trackingStatus MEDIUMINT NULL,
    priceChange FLOAT NULL
);

CREATE TABLE openOrdersTest (	 
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(20) NULL,
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

CREATE TABLE orderHistoryTest (	 
	exchangeName VARCHAR(15) NULL,
	tradePair VARCHAR(20) NULL,
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
describe openOrdersTest;
describe orderHistoryTest;
describe cTickerTest;
drop table cTicker;
drop table openOrders;
drop table orderHistory;

delete from cTicker where true=true;
delete from openOrders where true=true;
delete from orderHistory where true=true;

show tables;
describe openOrders;

select count(distinct tradePair) from orderHistory;
select count(distinct tradePair) from cTicker;
select distinct tradePair from orderHistory;
select count( tradePair) from cTicker;


select * from cTicker where recordTime > '2017-08-18';
select * from orderHistory where recordTime > '2017-08-17 14:33:34';
select * from openOrders where recordTime > '2017-08-17 00:31:34';

select * from cTicker where exchangeName = 'poloniex';
select * from openOrders where exchangeName = 'livecoin';
select * from orderHistory where exchangeName = 'livecoin';

select count(*) from cTicker;   
select count(*) from cTicker where exchangeName = 'poloniex';
select count(*) from openOrders;
select count(*) from orderHistory;

select distinct(exchangeName) from cTicker;
select distinct(exchangeName) from openOrders;
select distinct(exchangeName) from orderHistory;
select * from cTicker where exchangeName = 'yoBit';

select * from cTicker;
select * from orderHistory; 
select * from openOrders;