
CREATE TABLE cTicker (
	symbol VARCHAR(10) NULL,
	askPriceUSD FLOAT NULL,
	askPriceBTC FLOAT NULL,
	recordTime DATETIME NULL,
	timeSincePreviousEntry MEDIUMINT NULL
);