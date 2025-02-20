import winston from 'winston';
import config from 'config';

const NODE_ENV = config.get<string>('env'); 
const LOG_LEVEL = config.get<string>('log.level');
const LOG_DISABLED = config.get<boolean>('log.disabled');

console.log(
  `node env: ${NODE_ENV}, log level ${LOG_LEVEL}, logs enabled: ${
    LOG_DISABLED !== true
  }`,
);

const rootLogger: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.simple(),
  transports: [new winston.transports.Console({ silent: LOG_DISABLED })],
});

export const getLogger = () => {
  return rootLogger;
};
