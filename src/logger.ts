import winston from 'winston';

// Use a Console logger when used as CLI
const transports =
	require.main === module
		? []
		: [
				new winston.transports.Console({
					format: winston.format.simple(),
				}),
		  ];

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.cli(),
	transports,
});

export default logger;
